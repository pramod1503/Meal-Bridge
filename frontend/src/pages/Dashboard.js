import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import DonationCard from '../components/DonationCard';
import { getUserDonations, deleteDonation, getDonations } from '../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableDonations();
    } else {
      fetchUserDonations();
    }
  }, [activeTab]);
  
  // Debug user donations when they change
  useEffect(() => {
    if (donations.length > 0) {
      console.log('User donations:', donations);
    }
  }, [donations]);

  const fetchUserDonations = async () => {
    try {
      setLoading(true);
      const data = await getUserDonations();
      console.log('User donations from API:', data);
      setDonations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user donations:', err);
      setError('Failed to load your donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDonations = async () => {
    try {
      setLoading(true);
      const data = await getDonations();
      // Filter to show only available donations that are not expired
      const available = data.filter(donation => 
        donation.status === 'available' && 
        new Date(donation.expiryDate) > new Date()
      );
      setAvailableDonations(available);
      setError(null);
    } catch (err) {
      console.error('Error fetching available donations:', err);
      setError('Failed to load available donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await deleteDonation(id);
        // Refresh donations after delete
        fetchUserDonations();
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert(error.message || 'Failed to delete donation');
      }
    }
  };

  // Filter donations based on active tab
  const filteredDonations = activeTab === 'available' 
    ? availableDonations 
    : donations.filter(donation => {
        if (activeTab === 'donated') {
          // For donated tab, check if the user is the donor
          // First make sure donation.donor exists and has an _id property
          return donation.donor && 
                 ((typeof donation.donor === 'object' && donation.donor._id === user.id) || 
                  (typeof donation.donor === 'string' && donation.donor === user.id));
        } else if (activeTab === 'claimed') {
          // For claimed tab, check if the user is the recipient
          return donation.recipient && 
                 ((typeof donation.recipient === 'object' && donation.recipient._id === user.id) || 
                  (typeof donation.recipient === 'string' && donation.recipient === user.id));
        }
        return false;
      });

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <Link to="/donation" className="btn btn-primary">
          Create New Donation
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Welcome, {user?.name}</h5>
          <p className="card-text">
            This is your personal dashboard where you can manage your donations and see the items you've claimed.
          </p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Donations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donated' ? 'active' : ''}`}
            onClick={() => setActiveTab('donated')}
          >
            My Donations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveTab('claimed')}
          >
            Items I've Claimed
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="text-center py-5">
          <p>
            {activeTab === 'available'
              ? "No available donations at the moment."
              : activeTab === 'donated'
                ? "You haven't donated any items yet."
                : "You haven't claimed any items yet."}
          </p>
          {activeTab === 'available' && (
            <Link to="/donation" className="btn btn-primary">
              Be the first to donate!
            </Link>
          )}
          {activeTab === 'donated' && (
            <Link to="/donation" className="btn btn-primary">
              Create Your First Donation
            </Link>
          )}
          {activeTab === 'claimed' && (
            <button 
              onClick={() => setActiveTab('available')} 
              className="btn btn-primary"
            >
              Browse Available Donations
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredDonations.map(donation => (
            <div className="col-md-6 col-lg-4" key={donation._id}>
              {activeTab === 'available' ? (
                <DonationCard 
                  donation={donation} 
                  onUpdate={() => fetchAvailableDonations()} 
                />
              ) : (
                <div className="card mb-4 shadow-sm">
                  <div className={`card-header ${
                    donation.status === 'claimed' 
                      ? 'bg-success text-white' 
                      : donation.status === 'expired' 
                        ? 'bg-danger text-white' 
                        : 'bg-primary text-white'
                  }`}>
                    <h5 className="mb-0">{donation.title}</h5>
                  </div>
                  <div className="card-body">
                    <p>{donation.description}</p>
                    <div className="d-flex justify-content-between mb-2">
                      <span><strong>Quantity:</strong> {donation.quantity}</span>
                      <span><strong>Status:</strong> {donation.status}</span>
                    </div>
                    <p><strong>Location:</strong> {donation.location}</p>
                    <p><strong>Expires:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>
                    
                    <div className="d-flex justify-content-between mt-3">
                      <Link to={`/donation/${donation._id}`} className="btn btn-outline-primary">
                        View Details
                      </Link>
                      
                      {activeTab === 'donated' && (
                        <>
                          <Link to={`/donation/edit/${donation._id}`} className="btn btn-outline-secondary">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteDonation(donation._id)}
                            className="btn btn-outline-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

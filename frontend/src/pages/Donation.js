import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { createDonation, getDonationById, updateDonation, deleteDonation, claimDonation } from '../utils/api';

const Donation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isEditMode = location.pathname.includes('/edit/');
  const isViewMode = id && !isEditMode;
  const isCreateMode = !id && !isEditMode;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: 1,
    location: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEditMode || isViewMode);
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    // If in edit or view mode, fetch the donation data
    if ((isEditMode || isViewMode) && id) {
      const fetchDonation = async () => {
        try {
          setFetchLoading(true);
          const donationData = await getDonationById(id);
          setDonation(donationData);
          
          // If in edit mode, check if user is the donor
          if (isEditMode && donationData.donor._id !== user.id) {
            setError('You are not authorized to edit this donation');
            return;
          }
          
          // If in edit mode, set form data
          if (isEditMode) {
            // Format date for input field (YYYY-MM-DD)
            const expiryDate = new Date(donationData.expiryDate)
              .toISOString()
              .split('T')[0];
            
            setFormData({
              title: donationData.title,
              description: donationData.description,
              quantity: donationData.quantity,
              location: donationData.location,
              expiryDate
            });
          }
        } catch (err) {
          console.error('Error fetching donation:', err);
          setError('Failed to load donation data');
        } finally {
          setFetchLoading(false);
        }
      };
      
      fetchDonation();
    }
  }, [id, isEditMode, isViewMode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.expiryDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    
    // Check if expiry date is in the future
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();
    if (expiryDate <= today) {
      setError('Expiry date must be in the future');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEditMode && id) {
        // Update existing donation
        await updateDonation(id, formData);
      } else {
        // Create new donation
        await createDonation(formData);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving donation:', err);
      setError(err.response?.data?.message || 'Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        setLoading(true);
        await deleteDonation(id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting donation:', err);
        setError('Failed to delete donation');
        setLoading(false);
      }
    }
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      await claimDonation(id);
      // Refresh donation data
      const updatedDonation = await getDonationById(id);
      setDonation(updatedDonation);
      setLoading(false);
    } catch (err) {
      console.error('Error claiming donation:', err);
      setError('Failed to claim donation');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (fetchLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // View mode - display donation details
  if (isViewMode && donation) {
    const isOwner = user && donation.donor && user.id === donation.donor._id;
    const isClaimed = donation.status === 'claimed';
    const isExpired = new Date(donation.expiryDate) < new Date();

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className={`card-header ${isExpired ? 'bg-danger text-white' : isClaimed ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                <h2 className="mb-0">{donation.title}</h2>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <h5 className="card-title mb-3">Description</h5>
                <p className="card-text">{donation.description}</p>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5>Quantity</h5>
                    <p>{donation.quantity}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Location</h5>
                    <p>{donation.location}</p>
                  </div>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>Expiry Date</h5>
                    <p>{formatDate(donation.expiryDate)}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Status</h5>
                    <p>{donation.status}</p>
                  </div>
                </div>
                
                {donation.donor && (
                  <p className="mb-3"><strong>Donated by:</strong> {donation.donor.name}</p>
                )}
                
                {donation.recipient && (
                  <p className="mb-4"><strong>Claimed by:</strong> {donation.recipient.name}</p>
                )}
                
                <div className="d-flex justify-content-between">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary"
                  >
                    Back
                  </button>
                  
                  <div>
                    {isOwner && !isClaimed && (
                      <>
                        <Link to={`/donation/edit/${donation._id}`} className="btn btn-primary me-2">
                          Edit
                        </Link>
                        <button 
                          onClick={handleDelete}
                          className="btn btn-danger"
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                    
                    {!isOwner && !isClaimed && !isExpired && (
                      <button 
                        onClick={handleClaim}
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? 'Claiming...' : 'Claim Donation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create or Edit mode
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                {isEditMode ? 'Edit Donation' : 'Create New Donation'}
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Fresh Vegetables, Canned Goods"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    placeholder="Provide details about the food items"
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Address or area for pickup"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Donation' : 'Create Donation'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;

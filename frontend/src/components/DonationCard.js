import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { claimDonation } from '../utils/api';

const DonationCard = ({ donation, onUpdate }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const handleClaim = async () => {
    try {
      await claimDonation(donation._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error claiming donation:', error);
      alert(error.message || 'Failed to claim donation');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isExpired = new Date(donation.expiryDate) < new Date();
  const isOwner = user && donation.donor && user.id === donation.donor._id;
  const isClaimed = donation.status === 'claimed';

  return (
    <div className="card mb-4 shadow-sm">
      <div className={`card-header ${isExpired ? 'bg-danger text-white' : isClaimed ? 'bg-success text-white' : 'bg-primary text-white'}`}>
        <h5 className="mb-0">{donation.title}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">{donation.description}</p>
        <div className="d-flex justify-content-between mb-2">
          <span><strong>Quantity:</strong> {donation.quantity}</span>
          <span><strong>Location:</strong> {donation.location}</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span><strong>Expires:</strong> {formatDate(donation.expiryDate)}</span>
          <span><strong>Status:</strong> {donation.status}</span>
        </div>
        
        {donation.donor && (
          <p className="card-text"><small className="text-muted">Donated by: {donation.donor.name}</small></p>
        )}
        
        {donation.recipient && (
          <p className="card-text"><small className="text-muted">Claimed by: {donation.recipient.name}</small></p>
        )}
        
        <div className="d-flex justify-content-between mt-3">
          <Link to={`/donation/${donation._id}`} className="btn btn-outline-primary">
            View Details
          </Link>
          
          {isAuthenticated && !isOwner && !isClaimed && !isExpired && (
            <button 
              onClick={handleClaim} 
              className="btn btn-success"
            >
              Claim Donation
            </button>
          )}
          
          {isOwner && (
            <Link to={`/donation/edit/${donation._id}`} className="btn btn-outline-secondary">
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;

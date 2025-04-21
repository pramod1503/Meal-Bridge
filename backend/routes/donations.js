const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

// Get all donations
router.get('/', donationController.getAllDonations);

// Get user donations (protected)
router.get('/user', auth, donationController.getUserDonations);

// Create donation (protected)
router.post('/', auth, donationController.createDonation);

// Get donation by ID
router.get('/:id', donationController.getDonationById);

// Update donation (protected)
router.put('/:id', auth, donationController.updateDonation);

// Delete donation (protected)
router.delete('/:id', auth, donationController.deleteDonation);

// Claim donation (protected)
router.put('/:id/claim', auth, donationController.claimDonation);

module.exports = router;

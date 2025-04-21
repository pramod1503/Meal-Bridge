const Donation = require('../models/Donation');

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get donations by user (either as donor or recipient)
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const donations = await Donation.find({
      $or: [{ donor: userId }, { recipient: userId }]
    })
      .populate('donor', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new donation
exports.createDonation = async (req, res) => {
  try {
    const { title, description, quantity, location, expiryDate } = req.body;
    
    const donation = new Donation({
      title,
      description,
      quantity,
      location,
      expiryDate,
      donor: req.user._id
    });
    
    await donation.save();
    
    res.status(201).json(donation);
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('recipient', 'name email');
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update donation
exports.updateDonation = async (req, res) => {
  try {
    const { title, description, quantity, location, expiryDate, status } = req.body;
    
    let donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // Check if user is the donor
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this donation' });
    }
    
    // Update fields
    if (title) donation.title = title;
    if (description) donation.description = description;
    if (quantity) donation.quantity = quantity;
    if (location) donation.location = location;
    if (expiryDate) donation.expiryDate = expiryDate;
    if (status) donation.status = status;
    
    await donation.save();
    
    res.json(donation);
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // Check if user is the donor or admin
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this donation' });
    }
    
    // Use deleteOne instead of remove() which is deprecated
    await Donation.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Donation removed' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Claim donation
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // Check if donation is already claimed
    if (donation.status !== 'available') {
      return res.status(400).json({ message: `Donation is already ${donation.status}` });
    }
    
    // Check if user is trying to claim their own donation
    if (donation.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot claim your own donation' });
    }
    
    donation.status = 'claimed';
    donation.recipient = req.user._id;
    
    await donation.save();
    
    res.json(donation);
  } catch (error) {
    console.error('Claim donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

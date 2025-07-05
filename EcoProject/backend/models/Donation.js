const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  wasteName: String,
  wasteType: {
    type: String,
    enum: ['Plastic', 'E-waste', 'Cloth', 'Glass', 'Organic', 'Other', 'Unknown'],
    default: 'Unknown',
  },
  suitableFor: {
    type: String,
    enum: ['Company', 'Company or Public'],
    default: 'Company or Public'
  },
  description: String,
  quantity: Number,
  condition: {
    type: String,
    enum: ['New', 'Used', 'Damaged'],
  },
  expected: {
    type: String,
    enum: ['Free', 'Small Fee']
  },
  image: String,
  pickupLocation: String,
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);

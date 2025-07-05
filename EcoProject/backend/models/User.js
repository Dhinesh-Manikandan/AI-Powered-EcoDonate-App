const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // basic email format validation
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // Indian phone number validation
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['donor', 'org', 'admin', 'buyer'],
    default: 'donor',
    required: true
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

/**
 * Compound unique index: email + role
 * Allows same email across different roles but unique within the same role
 */
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);

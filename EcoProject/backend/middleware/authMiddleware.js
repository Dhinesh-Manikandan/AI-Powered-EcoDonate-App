const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔒 Middleware: Authenticate user
const protect = async (req, res, next) => {
  let token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach full user (excluding password)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// 🛡 Middleware: Role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };

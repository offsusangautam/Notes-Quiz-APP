// backend/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded ID, exclude passwordHash from response
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        console.error('User not found for id:', decoded.id);
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      console.log('Protected route accessed by user:', req.user.email);
      next(); // Proceed to next middleware or route handler
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token found in authorization header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

// Middleware to allow only admin users
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted to:', req.user.email);
    next();
  } else {
    console.error('Admin access denied for user:', req.user ? req.user.email : 'Unknown');
    res.status(403).json({ message: 'Admin access only' });
  }
};

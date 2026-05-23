const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const register = [
  ...registerValidation,
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use.' });
      }

      const user = await User.create({ name, email, password });
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },
];

// POST /api/auth/login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const login = [
  ...loginValidation,
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },
];

// GET /api/auth/me (protected)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };

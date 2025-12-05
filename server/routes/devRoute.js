import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Dev-only middleware: requires DEV_ACCESS_KEY and not allowed in production
const devKeyMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not available in production' });
  }

  const provided = req.headers['x-dev-key'] || req.body?.devKey;
  if (!process.env.DEV_ACCESS_KEY) {
    return res.status(500).json({ success: false, message: 'DEV_ACCESS_KEY not set on server' });
  }

  if (!provided || provided !== process.env.DEV_ACCESS_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid dev key' });
  }

  next();
};

// POST /api/dev/get-token
// Body: { email }
// Returns: { success, token, user }
router.post('/get-token', devKeyMiddleware, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ success: true, token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Dev get-token error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal error' });
  }
});

export default router;

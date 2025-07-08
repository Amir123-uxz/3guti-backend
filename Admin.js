// Admin.js
const express = require('express');
const Transaction = require('./models/Transaction');
const Match = require('./models/Match');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const router = express.Router();

// Simple admin auth by mobile/password
router.post('/login', (req, res) => {
  const { mobile, password } = req.body;
  if (mobile===process.env.ADMIN_MOBILE && password===process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.SECRET_KEY);
    return res.json({ token });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

// Middleware
const adminAuth = (req, res, next) => {
  try {
    const payload = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    if (!payload.admin) throw 0;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// List pending transactions
router.get('/transactions', adminAuth, async (req, res) => {
  const txs = await Transaction.find().populate('user');
  res.json(txs);
});

// Approve or reject a transaction
router.post('/transactions/:id', adminAuth, async (req, res) => {
  const { status } = req.body; // processing/done/rejected
  const tx = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (status==='done' && tx.type==='deposit') {
    await User.findByIdAndUpdate(tx.user, { $inc: { wallet: tx.amount } });
  }
  if (status==='done' && tx.type==='withdrawal') {
    await User.findByIdAndUpdate(tx.user, { $inc: { wallet: -tx.amount } });
  }
  res.json({ success: true, tx });
});

// List matches
router.get('/matches', adminAuth, async (req, res) => {
  const matches = await Match.find().populate('players winner');
  res.json(matches);
});

module.exports = router;

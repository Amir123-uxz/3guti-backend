// Wallet.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Match = require('./models/Match');
const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  try {
    const payload = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ balance: user.wallet });
});

// Deposit request
router.post('/deposit', auth, async (req, res) => {
  const { amount, txnId, name } = req.body;
  const tx = await Transaction.create({
    user: req.userId, type: 'deposit', amount, details: { txnId, name }
  });
  res.json({ success: true, txId: tx._id });
});

// Withdrawal request
router.post('/withdraw', auth, async (req, res) => {
  const { amount, upiId, name } = req.body;
  const user = await User.findById(req.userId);
  if (user.wallet < amount) return res.status(400).json({ error: 'Insufficient funds' });
  const tx = await Transaction.create({
    user: req.userId, type: 'withdrawal', amount, details: { upiId, name }
  });
  res.json({ success: true, txId: tx._id });
});

// Payout after match (internal use)
router.post('/payout', async (req, res) => {
  const { matchId, winnerId } = req.body;
  const match = await Match.findById(matchId);
  if (!match || match.status !== 'completed') return res.status(400).json({ error: 'Invalid match' });

  const commission = Math.round(match.betAmount * 0.05);
  const payout = match.betAmount * 2 - commission;
  await User.findByIdAndUpdate(winnerId, { $inc: { wallet: payout } });
  await Transaction.create({ user: winnerId, type: 'payout', amount: payout });
  res.json({ success: true, commission });
});

module.exports = router;

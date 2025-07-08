// server.js
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./Auth');
const walletRoutes = require('./Wallet');
const adminRoutes = require('./Admin');
const matchRoutes = require('./Match');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);

// Health‑check
app.get('/', (req, res) => {
  res.send('🎮 3 Guti backend is live!');
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// server.js
const express = require('express');
const connectDB = require('./db'); // Uses db.js
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🎮 3 Guti backend is live!');
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

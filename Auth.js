// Auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { mobile, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ mobile, passwordHash: hash });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Mobile already in use' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });
  if (!user || !await bcrypt.compare(password, user.passwordHash))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  res.json({ token });
});

module.exports = router;

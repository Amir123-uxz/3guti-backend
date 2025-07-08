// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  wallet: { type: Number, default: 0 }, // in points/₹
});

module.exports = mongoose.model('User', userSchema);

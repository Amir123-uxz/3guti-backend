// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  room: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  betAmount: { type: Number, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commission: { type: Number }, // 5% cut
  status: { type: String, enum: ['ongoing','completed'], default: 'ongoing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);

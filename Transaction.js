// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit','withdrawal','payout'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','done','rejected'], default: 'pending' },
  details: { // for deposit: txnId & name; for withdrawal: upiId & name
    txnId: String,
    name: String,
    upiId: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

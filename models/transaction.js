const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  hash: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  timestamp: { type: Number, required: true },
  blockNumber: { type: Number, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  receiverEmail: {
    type: String,
    default: "",
  },

  walletAddress: {
    type: String,
    default: "",
  },

  blockchainTxHash: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
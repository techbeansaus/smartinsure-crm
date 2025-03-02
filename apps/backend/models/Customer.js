const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  // Additional customer fields
});

module.exports = mongoose.model('Customer', CustomerSchema);

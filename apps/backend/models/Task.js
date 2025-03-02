// apps/backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {type: String, required: true},
  policyNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);

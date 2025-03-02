const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    id: { type: String, required: true },
    policyNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    // Additional policy fields
});

module.exports = mongoose.model('Policy', PolicySchema);

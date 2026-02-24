const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    order_id: { type: String },
    payment_id: { type: String },
    amount: { type: Number, required: true },
    donor_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    certificate_id: { type: String },
    status: { type: String, default: 'Success' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);

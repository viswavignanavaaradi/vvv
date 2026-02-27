const mongoose = require('mongoose');

const patronSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profession: { type: String },
    experience: { type: String },
    advisoryWing: { type: String },
    linkedinProfile: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, default: 'active' },
    subscription_id: { type: String, unique: true },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patron', patronSchema);

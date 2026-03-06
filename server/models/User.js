const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: 'VVV User' },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For manual signups
    picture: { type: String },
    role: { type: String, enum: ['patron', 'volunteer', 'admin', 'intern'], default: 'patron' },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    bloodGroup: { type: String },
    state: { type: String },
    district: { type: String },
    college: { type: String },
    education: { type: String },
    wings: { type: String },
    priorityWing: { type: String },
    interests: { type: String },
    picture: { type: String },
    contributed: { type: Boolean, default: false },
    payment_id: { type: String },
    documents: [{
        name: String,
        url: String,
        cloudinary_id: String
    }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);

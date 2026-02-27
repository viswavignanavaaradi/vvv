const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    bloodGroup: { type: String },
    state: { type: String },
    district: { type: String },
    collegeName: { type: String },
    education: { type: String },
    duration: { type: String }, // e.g., '45 days', '3 months'
    wings: { type: String }, // Preferred wings/missions
    priorityWing: { type: String },
    interests: { type: String },
    linkedinProfile: { type: String },
    branch: { type: String },
    yearOfStudy: { type: String },
    profilePhoto: { type: String },
    documents: [{
        name: String,
        url: String,
        cloudinary_id: String
    }],
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    adminMessage: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Intern', internSchema);

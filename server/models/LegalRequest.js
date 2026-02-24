const mongoose = require('mongoose');

const LegalRequestSchema = new mongoose.Schema({
    requestId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: true },
    adminMessage: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Submitted', 'In Review', 'In Process', 'Done', 'Rejected'],
        default: 'Submitted'
    },
    documents: [{
        name: String,
        url: String,
        cloudinary_id: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LegalRequest', LegalRequestSchema);

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscription_id: { type: String, required: true, unique: true },
    plan_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired', 'failed'],
        default: 'created'
    },
    razorpay_signature: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

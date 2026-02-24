const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { createObjectCsvWriter } = require('csv-writer');

// Models
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Donation = require('./models/Donation');
const LegalRequest = require('./models/LegalRequest');
const Subscription = require('./models/Subscription');
const { generateIDCard } = require('./utils/idCard');
const { generateCertificate } = require('./utils/certificate');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        ensurePlans(); // Initialize Plans on DB connection
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Setup
const photoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vv_foundation',
        allowed_formats: ['jpg', 'png'],
        resource_type: 'image'
    }
});

const docStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vv_foundation',
        resource_type: 'auto',
        public_id: (req, file) => {
            const name = file.originalname.split('.')[0] || 'doc';
            return `${name}_${Date.now()}`;
        }
    }
});

const uploadPhoto = multer({ storage: photoStorage });
const uploadDoc = multer({ storage: docStorage });

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

// Plans Cache
let plans = {
    '99': null,
    '199': null,
    '299': null,
    '499': null,
    '999': null,
    '1499': null,
    '1999': null,
    '2499': null,
    '2999': null,
    '4999': null
};

async function ensurePlans() {
    console.log('[Razorpay] Checking/Creating Plans...');
    try {
        const existingPlans = await razorpay.plans.all();

        for (const amount of Object.keys(plans)) {
            let found = existingPlans.items.find(p => p.item.amount === parseInt(amount) * 100 && p.period === 'monthly');
            if (!found) {
                console.log(`[Razorpay] Creating Plan for monthly ₹${amount}...`);
                found = await razorpay.plans.create({
                    period: 'monthly',
                    interval: 1,
                    item: {
                        name: `Monthly Patronage - ₹${amount}`,
                        amount: parseInt(amount) * 100,
                        currency: 'INR',
                        description: `Monthly contribution of ₹${amount} to VVV Foundation`
                    }
                });
            }
            plans[amount] = found.id;
        }
        console.log('[Razorpay] Plans Ready:', plans);
    } catch (err) {
        console.error('[Razorpay] Plan Error:', err.message);
    }
}

// Verify Razorpay Config on startup
if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('YourKeyID')) {
    console.log('[Razorpay] Configured with key ID:', process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...');
} else {
    console.warn('[Razorpay] Warning: Razorpay keys are not configured or still using placeholders.');
}

// APIs
app.get('/api/get-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

app.post('/api/create-subscription', async (req, res) => {
    const { amount, email, name } = req.body;
    const planId = plans[amount.toString()];

    if (!planId) {
        return res.status(400).json({ error: `No active plan found for amount: ${amount}` });
    }

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 120, // 10 years or indefinite basically
            notes: {
                email: email,
                name: name
            }
        });

        // Save initial record
        await Subscription.create({
            subscription_id: subscription.id,
            plan_id: planId,
            customer_name: name,
            email: email,
            amount: parseInt(amount),
            status: subscription.status
        });

        res.json(subscription);
    } catch (err) {
        console.error('[Subscription API] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Webhook Endpoint for Razorpay
app.post('/api/razorpay-webhook', async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !secret) {
        return res.status(400).send('Missing signature or secret');
    }

    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== signature) {
        console.warn('[Webhook] Invalid Signature Received');
        return res.status(400).send('Invalid Signature');
    }

    const event = req.body.event;
    console.log(`[Razorpay Webhook] Received Event: ${event}`);

    try {
        switch (event) {
            case 'subscription.charged': {
                const { payload } = req.body;
                const subscriptionId = payload.subscription.entity.id;
                const paymentId = payload.payment.entity.id;
                const amount = payload.payment.entity.amount / 100;

                const sub = await Subscription.findOne({ subscription_id: subscriptionId });
                if (sub) {
                    const certificateId = `CERT-SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                    const donation = new Donation({
                        payment_id: paymentId,
                        amount: amount,
                        donor_name: sub.customer_name,
                        email: sub.email,
                        certificate_id: certificateId
                    });
                    await donation.save();
                    console.log(`[Webhook] Recorded recurring payment for ${sub.email}`);
                }
                break;
            }
            case 'subscription.cancelled':
            case 'subscription.halted': {
                const subId = req.body.payload.subscription.entity.id;
                await Subscription.findOneAndUpdate({ subscription_id: subId }, { status: event.split('.')[1] });
                break;
            }
            case 'payment.failed': {
                console.warn(`[Webhook] Payment Failed:`, req.body.payload.payment.entity.error_description);
                // Future: Send email alert to user
                break;
            }
        }
    } catch (err) {
        console.error('[Webhook Error]', err);
    }

    res.json({ status: 'ok' });
});

app.post('/api/subscription-success', async (req, res) => {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, amount, name, email } = req.body;

    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            await Subscription.findOneAndUpdate(
                { subscription_id: razorpay_subscription_id },
                { status: 'active', razorpay_signature: razorpay_signature, updatedAt: new Date() }
            );

            // Also record it as an initial donation for the certificate
            const certificateId = `CERT-SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            const donation = new Donation({
                payment_id: razorpay_payment_id,
                amount,
                donor_name: name,
                email,
                certificate_id: certificateId
            });
            await donation.save();

            res.json({ status: 'success', certificate_id: certificateId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});

app.post('/api/create-order', async (req, res) => {
    const { amount } = req.body;

    // Robust check for missing or placeholder keys
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('YourKeyID') || keySecret.includes('YourKeySecret')) {
        console.error('[Razorpay API] Error: Keys missing or unconfigured.');
        return res.status(400).json({
            error: "Razorpay keys are not configured. Please update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your server/.env file."
        });
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payment-success', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donor_name, email, phone } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature === razorpay_signature) {
        const certificateId = `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        try {
            const donation = new Donation({
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount, donor_name, email, phone,
                certificate_id: certificateId
            });
            await donation.save();
            res.json({ status: 'success', certificate_id: certificateId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});

// Volunteer Enrollment
app.post('/api/volunteer/enroll', async (req, res) => {
    const {
        fullName, email, contactNumber, age, gender, bloodGroup,
        state, district, collegeName, education, preferredWings,
        mainPriorityWing, interests, willingToContribute, profilePhoto,
        documents
    } = req.body;

    try {
        const volunteer = await Volunteer.findOneAndUpdate(
            { email },
            {
                fullName,
                email,
                age,
                gender,
                phone: contactNumber,
                bloodGroup,
                state,
                district,
                college: collegeName,
                education,
                wings: preferredWings,
                priorityWing: mainPriorityWing,
                interests,
                documents: documents || [],
                contributed: willingToContribute === 'no'
            },
            { upsert: true, new: true }
        );

        // Update User info
        await User.findOneAndUpdate(
            { email },
            {
                name: fullName,
                role: 'volunteer',
                ...(profilePhoto && { picture: profilePhoto })
            },
            { upsert: true }
        );

        res.json({ status: 'success', enrollmentId: volunteer._id });
    } catch (err) {
        console.error("Enrollment Error Details:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/volunteer/payment-success', async (req, res) => {
    const { razorpay_payment_id, enrollmentId } = req.body;
    try {
        await Volunteer.findByIdAndUpdate(enrollmentId, {
            contributed: true,
            payment_id: razorpay_payment_id
        });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Profile Fetch
app.get('/api/user/profile', async (req, res) => {
    const { email } = req.query;
    try {
        const volunteer = await Volunteer.findOne({ email });
        const user = await User.findOne({ email });
        const donations = await Donation.find({ email });
        const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

        res.json({
            user,
            volunteer,
            donations: {
                total: totalDonated,
                count: donations.length,
                history: donations
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ID Card Download
app.get('/api/user/download-id-card', async (req, res) => {
    const { email } = req.query;
    console.log('ID Card Download Request for:', email);
    try {
        const volunteer = await Volunteer.findOne({ email });
        if (!volunteer) {
            console.log('Volunteer not found in DB for:', email);
            return res.status(404).json({ error: 'Volunteer not found' });
        }

        // Fetch user photo from User model
        const user = await User.findOne({ email });

        const volunteerWithPhoto = {
            ...volunteer.toObject(),
            profilePhoto: user?.picture || volunteer.profilePhoto
        };

        const filePath = await generateIDCard(volunteerWithPhoto);
        const downloadName = `ID_${(volunteer.fullName || 'Volunteer').replace(/ /g, '_')}.pdf`;

        res.download(filePath, downloadName, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) res.status(500).send('Error downloading file');
            }
        });
    } catch (err) {
        console.error('ID Card Download Flow Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Convenience route for direct certificate download by ID
app.get('/api/certificate/:certId', async (req, res) => {
    const { certId } = req.params;
    res.redirect(`/api/user/download-certificate?certId=${certId}`);
});

// Certificate Download
app.get('/api/user/download-certificate', async (req, res) => {
    const { email, certId } = req.query;
    try {
        let donation;
        const emailRegex = email ? new RegExp(`^${email.trim()}$`, 'i') : null;

        if (certId) {
            donation = await Donation.findOne({ certificate_id: certId });
        } else if (emailRegex) {
            donation = await Donation.findOne({ email: emailRegex }).sort({ date: -1 });
        }

        if (!donation && emailRegex) {
            // Fallback to Volunteer search if no direct donation record exists
            const volunteer = await Volunteer.findOne({ email: emailRegex });
            if (volunteer && volunteer.contributed) {
                donation = {
                    donor_name: volunteer.fullName,
                    certificate_id: (volunteer._id || 'PATRON').toString().substr(-6).toUpperCase(),
                    date: volunteer.createdAt || new Date()
                };
            }
        }

        if (!donation) {
            console.log('[Certificate API] Record not found for:', email, certId);
            return res.status(404).json({ error: 'Donation record not found' });
        }

        generateCertificate(donation, (filePath) => {
            res.download(filePath, `Certificate_${donation.certificate_id || 'Donor'}.pdf`);
        });
    } catch (err) {
        console.error('[Certificate API] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Profile Update (CRUD)
app.post('/api/user/update-profile', async (req, res) => {
    const { email, updates, type } = req.body; // type: 'user' or 'volunteer'
    try {
        if (type === 'volunteer') {
            await Volunteer.findOneAndUpdate({ email }, updates);
        } else {
            await User.findOneAndUpdate({ email }, updates);
        }
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Image Upload
app.post('/api/user/upload-photo', uploadPhoto.single('photo'), async (req, res) => {
    const { email } = req.body || {};
    if (!email || !req.file) {
        return res.status(400).json({ error: 'Missing email or photo' });
    }
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { picture: req.file.path },
            { new: true, upsert: true }
        );
        res.json({ status: 'success', url: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Document Upload
app.post('/api/user/upload-document', uploadDoc.single('document'), async (req, res) => {
    const { email, docName } = req.body || {};
    if (!email || !req.file) {
        return res.status(400).json({ error: 'Missing email or document' });
    }
    try {
        await Volunteer.findOneAndUpdate(
            { email },
            { $push: { documents: { name: docName || req.file.originalname, url: req.file.path, cloudinary_id: req.file.filename } } },
            { upsert: true }
        );
        res.json({ status: 'success', url: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin APIs
app.get('/api/admin/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Legal Request Management
app.post('/api/legal/submit', uploadDoc.array('files'), async (req, res) => {
    const { fullName, email, phone, address, message } = req.body;
    try {
        const count = await LegalRequest.countDocuments();
        const requestId = `VVVLR${(count + 1).toString().padStart(4, '0')}`;
        console.log('Generated Legal Request ID:', requestId);

        const documents = req.files ? req.files.map(file => ({
            name: file.originalname,
            url: file.path,
            cloudinary_id: file.filename
        })) : [];

        const request = new LegalRequest({
            requestId, fullName, email, phone, address, message, documents
        });
        await request.save();
        res.json({ status: 'success', requestId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/legal-requests', async (req, res) => {
    try {
        const requests = await LegalRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/legal-requests/:id/status', async (req, res) => {
    const { status, adminMessage } = req.body;
    try {
        await LegalRequest.findByIdAndUpdate(req.params.id, { status, adminMessage });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/legal/status/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        console.log('Backend searching for:', requestId);
        const request = await LegalRequest.findOne({
            requestId: { $regex: new RegExp(`^${requestId.trim()}$`, 'i') }
        });
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({
            status: request.status,
            adminMessage: request.adminMessage,
            createdAt: request.createdAt,
            fullName: request.fullName
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[TRACE_VER_3] Server running on port ${PORT}`);
});

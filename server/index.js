// MUST BE FIRST — Force IPv4 before any network module loads
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

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
const nodemailer = require('nodemailer');

// Models
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Intern = require('./models/Intern');
const Donation = require('./models/Donation');
const LegalRequest = require('./models/LegalRequest');
const Subscription = require('./models/Subscription');
const Patron = require('./models/Patron');
const galleryRouter = require('./routes/gallery');
const { generateIDCard } = require('./utils/idCard');
const { generateCertificate } = require('./utils/certificate');

dotenv.config();

// ─── Email Transporter (v4.9.4 - Hardcoded IPv4 to bypass IPv6 DNS) ───────────
// Using hardcoded Gmail SMTP IPv4 address to avoid ENETUNREACH on IPv6-blocked hosts
const transporter = nodemailer.createTransport({
    host: '74.125.133.108', // Gmail SMTP hardcoded IPv4 — completely bypasses IPv6 DNS
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL || 'viswavignanavaaradi@gmail.com',
        pass: (process.env.APP_PASSWORD || process.env.EMAIL_PASS || '').trim().replace(/\s/g, '')
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com' // SNI must still match Gmail cert even with hardcoded IP
    }
});

// Verify Transporter on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('[Nodemailer] Transporter Error:', error.message);
    } else {
        console.log('[Nodemailer] Transporter is ready to send messages');
    }
});

const VERSION = "4.9.4";
const LAST_UPDATED = "2026-03-08 IST";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        console.log(`[CORS Request] Origin: ${origin}`);
        if (!origin) return callback(null, true);
        const isVercel = origin.endsWith('.vercel.app');
        const isLocal = origin.includes('localhost');
        const isCustomDomain = origin.endsWith('viswavignanavaaradhi.org');
        if (isVercel || isLocal || isCustomDomain) {
            return callback(null, true);
        }
        console.warn(`[CORS Blocked] Origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Basic Routes ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: 'VVV Nexus API is running',
        status: 'healthy',
        version: VERSION,
        lastUpdated: LAST_UPDATED
    });
});

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use(bodyParser.json());
app.use('/api/gallery', galleryRouter);

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    dbName: 'vvv_ngo'
})
    .then(() => {
        const dbName = mongoose.connection.name;
        const host = mongoose.connection.host;
        console.log(`[MongoDB] Connected to host: ${host}`);
        console.log(`[MongoDB] Active Database: ${dbName}`);
        ensurePlans();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// ─── Cloudinary ───────────────────────────────────────────────────────────────
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('[Cloudinary] WARNING: Missing configuration environment variables!');
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('[Cloudinary] Configured successfully');
}

// ─── Multer ───────────────────────────────────────────────────────────────────
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

// ─── Razorpay ─────────────────────────────────────────────────────────────────
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('YourKeyID')) {
    console.log('[Razorpay] Configured with key ID:', process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...');
} else {
    console.warn('[Razorpay] Warning: Keys are not configured or still using placeholders.');
}

// ─── Plans Cache ──────────────────────────────────────────────────────────────
let plans = {
    '99': null, '199': null, '299': null, '499': null, '999': null,
    '1499': null, '1999': null, '2499': null, '2999': null, '4999': null
};

async function ensurePlans() {
    console.log('[Razorpay] Checking/Creating Plans...');
    try {
        const existingPlans = await razorpay.plans.all();
        for (const amount of Object.keys(plans)) {
            let found = existingPlans.items.find(
                p => p.item.amount === parseInt(amount) * 100 && p.period === 'monthly'
            );
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

// ─── User Status Check ────────────────────────────────────────────────────────
app.get('/api/user/status', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    try {
        const [volunteer, intern, patron] = await Promise.all([
            Volunteer.findOne({ email }),
            Intern.findOne({ email }),
            Patron.findOne({ email })
        ]);
        res.json({
            isVolunteer: !!volunteer,
            isIntern: !!intern,
            isPatron: !!patron && patron.status === 'active'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Razorpay Key ─────────────────────────────────────────────────────────────
app.get('/api/get-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// ─── Subscription ─────────────────────────────────────────────────────────────
app.post('/api/create-subscription', async (req, res) => {
    const { amount, email, name } = req.body;
    if (!amount || parseInt(amount) <= 0) {
        return res.status(400).json({ error: 'Please enter a valid amount greater than zero' });
    }
    const planId = plans[amount.toString()];
    if (!planId) {
        return res.status(400).json({ error: `No active plan found for amount: ${amount}` });
    }
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 120,
            notes: { email, name }
        });
        await Subscription.create({
            subscription_id: subscription.id,
            plan_id: planId,
            customer_name: name,
            email,
            amount: parseInt(amount),
            status: subscription.status
        });
        res.json(subscription);
    } catch (err) {
        console.error('[Subscription API] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── Razorpay Webhook ─────────────────────────────────────────────────────────
app.post('/api/razorpay-webhook', async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !secret) return res.status(400).send('Missing signature or secret');

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
                    await new Donation({
                        payment_id: paymentId,
                        amount,
                        donor_name: sub.customer_name,
                        email: sub.email,
                        certificate_id: certificateId
                    }).save();
                    await Patron.findOneAndUpdate(
                        { email: sub.email },
                        {
                            fullName: sub.customer_name,
                            email: sub.email,
                            amount,
                            status: 'active',
                            subscription_id: subscriptionId,
                            date: new Date()
                        },
                        { upsert: true, new: true }
                    );
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
                break;
            }
        }
    } catch (err) {
        console.error('[Webhook Error]', err);
    }

    res.json({ status: 'ok' });
});

// ─── Patron Enroll ────────────────────────────────────────────────────────────
app.post('/api/patron/enroll', async (req, res) => {
    const { fullName, email, phone, profession, experience, advisoryWing, linkedinProfile, amount, subscriptionId } = req.body;
    try {
        const patron = await Patron.findOneAndUpdate(
            { email },
            {
                fullName, email, phone, profession, experience,
                advisoryWing, linkedinProfile, amount,
                subscription_id: subscriptionId,
                status: 'active',
                date: new Date()
            },
            { upsert: true, new: true }
        );
        await User.findOneAndUpdate(
            { email },
            { name: fullName, role: 'patron' },
            { upsert: true }
        );
        res.json({ status: 'success', patron });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Subscription Success ─────────────────────────────────────────────────────
app.post('/api/subscription-success', async (req, res) => {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, amount, name, email } = req.body;
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            await Subscription.findOneAndUpdate(
                { subscription_id: razorpay_subscription_id },
                { status: 'active', razorpay_signature, updatedAt: new Date() }
            );
            const certificateId = `CERT-SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            await new Donation({
                payment_id: razorpay_payment_id,
                amount, donor_name: name, email, certificate_id: certificateId
            }).save();
            await Patron.findOneAndUpdate(
                { email },
                { fullName: name, email, amount, status: 'active', subscription_id: razorpay_subscription_id, date: new Date() },
                { upsert: true, new: true }
            );
            res.json({ status: 'success', certificate_id: certificateId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});

// ─── Create Order ─────────────────────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
    const { amount } = req.body;
    if (!amount || parseInt(amount) <= 0) {
        return res.status(400).json({ error: 'Please enter a valid amount greater than zero' });
    }
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret || keyId.includes('YourKeyID') || keySecret.includes('YourKeySecret')) {
        return res.status(400).json({ error: "Razorpay keys are not configured." });
    }
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── Payment Success ──────────────────────────────────────────────────────────
app.post('/api/payment-success', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donor_name, email, phone } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature === razorpay_signature) {
        const certificateId = `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        try {
            await new Donation({
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount, donor_name, email, phone, certificate_id: certificateId
            }).save();
            res.json({ status: 'success', certificate_id: certificateId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});

// ─── Volunteer Enrollment ─────────────────────────────────────────────────────
app.post('/api/volunteer/enroll', async (req, res) => {
    const {
        fullName, email, contactNumber, age, gender, bloodGroup,
        state, district, collegeName, education, preferredWings,
        mainPriorityWing, interests, willingToContribute, profilePhoto,
        documents, profession, occupation, organization, experience
    } = req.body;

    try {
        const volunteer = await Volunteer.findOneAndUpdate(
            { email },
            {
                fullName, email, age, gender,
                phone: contactNumber, bloodGroup, state, district,
                college: collegeName, education, profession, occupation,
                organization, experience, wings: preferredWings,
                priorityWing: mainPriorityWing, interests,
                documents: documents || [],
                contributed: willingToContribute === 'no'
            },
            { upsert: true, new: true }
        );
        await User.findOneAndUpdate(
            { email },
            { name: fullName, role: 'volunteer', ...(profilePhoto && { picture: profilePhoto }) },
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
        await Volunteer.findByIdAndUpdate(enrollmentId, { contributed: true, payment_id: razorpay_payment_id });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Profile Fetch ────────────────────────────────────────────────────────────
app.get('/api/user/profile', async (req, res) => {
    const { email } = req.query;
    try {
        const volunteer = await Volunteer.findOne({ email });
        const user = await User.findOne({ email });
        const donations = await Donation.find({ email });
        const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
        res.json({
            user, volunteer,
            donations: { total: totalDonated, count: donations.length, history: donations }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ID Card Download ─────────────────────────────────────────────────────────
app.get('/api/user/download-id-card', async (req, res) => {
    const { email } = req.query;
    console.log('ID Card Download Request for:', email);
    try {
        const volunteer = await Volunteer.findOne({ email });
        if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

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

// ─── Certificate Routes ───────────────────────────────────────────────────────
app.get('/api/certificate/:certId', async (req, res) => {
    const { certId } = req.params;
    res.redirect(`/api/user/download-certificate?certId=${certId}`);
});

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
            return res.status(404).json({ error: 'Donation record not found' });
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const verificationUrl = `${protocol}://${host}/api/certificate/${donation.certificate_id}`;

        const filePath = await generateCertificate(donation, verificationUrl);
        const timestamp = Date.now();
        const downloadName = `Certificate_${(donation.donor_name || 'Patron').replace(/ /g, '_')}_${timestamp}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);

        res.download(filePath, downloadName, (err) => {
            if (err) {
                console.error('[Certificate API] Send Error:', err);
                if (!res.headersSent) res.status(500).send('Error downloading certificate');
            }
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (cleanupErr) {
                console.error('[Certificate API] Cleanup Error:', cleanupErr.message);
            }
        });
    } catch (err) {
        console.error('[Certificate API] Critical Catch:', err);
        if (!res.headersSent) res.status(500).json({ error: err.message });
    }
});

// ─── Intern Enrollment ────────────────────────────────────────────────────────
app.post('/api/intern/enroll', async (req, res) => {
    const {
        fullName, email, contactNumber, age, gender, bloodGroup,
        state, district, collegeName, education, duration, preferredWings,
        mainPriorityWing, interests, profilePhoto, achievements,
        linkedinProfile, branch, yearOfStudy
    } = req.body;

    try {
        const intern = await Intern.findOneAndUpdate(
            { email },
            {
                fullName, email, age, gender, phone: contactNumber,
                bloodGroup, state, district, collegeName, education,
                duration, wings: preferredWings, priorityWing: mainPriorityWing,
                interests, profilePhoto, documents: achievements || [],
                linkedinProfile, branch, yearOfStudy, status: 'pending'
            },
            { upsert: true, new: true }
        );
        await User.findOneAndUpdate(
            { email },
            { name: fullName, role: 'intern', ...(profilePhoto && { picture: profilePhoto }) },
            { upsert: true }
        );
        res.json({ status: 'success', enrollmentId: intern._id });
    } catch (err) {
        console.error("Intern Enrollment Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ─── System Diagnostic ───────────────────────────────────────────────────────
app.get('/api/debug/system', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        time: new Date().toISOString(),
        version: VERSION,
        memory: {
            rss: `${(mem.rss / 1024 / 1024).toFixed(2)}MB`,
            heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)}MB`,
            heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            external: `${(mem.external / 1024 / 1024).toFixed(2)}MB`,
        },
        uptime: `${process.uptime().toFixed(0)}s`,
        env: process.env.NODE_ENV || 'production'
    });
});

// ─── Profile Update ───────────────────────────────────────────────────────────
app.post('/api/user/update-profile', async (req, res) => {
    const { email, updates, type } = req.body;
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

// ─── Photo Upload ─────────────────────────────────────────────────────────────
app.post('/api/user/upload-photo', uploadPhoto.single('photo'), async (req, res) => {
    const { email } = req.body || {};
    if (!email || !req.file) return res.status(400).json({ error: 'Missing email or photo' });
    try {
        await User.findOneAndUpdate({ email }, { picture: req.file.path }, { new: true, upsert: true });
        await Volunteer.findOneAndUpdate({ email }, { picture: req.file.path });
        console.log(`[Upload] Photo updated for ${email}: ${req.file.path}`);
        res.json({ status: 'success', url: req.file.path });
    } catch (err) {
        console.error('[Upload Error] Photo:', err.message);
        res.status(500).json({ error: 'Image upload failed. Please verify Cloudinary settings.' });
    }
});

// ─── Document Upload ──────────────────────────────────────────────────────────
app.post('/api/user/upload-document', uploadDoc.single('document'), async (req, res) => {
    const { email, docName } = req.body || {};
    if (!email || !req.file) return res.status(400).json({ error: 'Missing email or document' });
    try {
        await Volunteer.findOneAndUpdate(
            { email },
            { $push: { documents: { name: docName || req.file.originalname, url: req.file.path, cloudinary_id: req.file.filename } } },
            { upsert: true }
        );
        res.json({ status: 'success', url: req.file.path });
    } catch (err) {
        console.error('[Upload Error] Document:', err.message);
        res.status(500).json({ error: 'Document upload failed.' });
    }
});

// ─── Intern Achievement Upload ────────────────────────────────────────────────
app.post('/api/intern/upload-achievement', uploadDoc.single('document'), async (req, res) => {
    const { email, docName } = req.body || {};
    if (!email || !req.file) return res.status(400).json({ error: 'Missing email or document' });
    try {
        await Intern.findOneAndUpdate(
            { email },
            { $push: { documents: { name: docName || req.file.originalname, url: req.file.path, cloudinary_id: req.file.filename } } },
            { upsert: true }
        );
        res.json({ status: 'success', url: req.file.path });
    } catch (err) {
        console.error('[Upload Error] Intern Document:', err.message);
        res.status(500).json({ error: 'Document upload failed.' });
    }
});

// ─── Admin APIs ───────────────────────────────────────────────────────────────
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
        const donations = await Donation.find().sort({ date: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/patrons', async (req, res) => {
    try {
        const patrons = await Patron.find().sort({ date: -1 });
        res.json(patrons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/interns', async (req, res) => {
    try {
        const interns = await Intern.find().sort({ date: -1 });
        res.json(interns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/interns/:id/status', async (req, res) => {
    const { status, adminMessage } = req.body;
    try {
        const intern = await Intern.findByIdAndUpdate(req.params.id, { status, adminMessage }, { new: true });
        console.log(`[Notification] Status update for ${intern.email}: ${status}`);
        res.json({ status: 'success', intern });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Legal Requests ───────────────────────────────────────────────────────────
app.post('/api/legal/submit', uploadDoc.array('files'), async (req, res) => {
    const { fullName, email, phone, address, message } = req.body;
    try {
        const count = await LegalRequest.countDocuments();
        const requestId = `VVVLR${(count + 1).toString().padStart(4, '0')}`;

        const documents = req.files ? req.files.map(file => ({
            name: file.originalname,
            url: file.path,
            cloudinary_id: file.filename
        })) : [];

        const request = new LegalRequest({ requestId, fullName, email, phone, address, message, documents });
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
        const request = await LegalRequest.findOne({
            requestId: { $regex: new RegExp(`^${requestId.trim()}$`, 'i') }
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });
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

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
    const { fullName, username, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ error: 'Email or Username already exists' });

        const user = new User({
            name: fullName, username, email,
            password, // NOTE: Hash in production
            role: role || 'patron'
        });
        await user.save();
        res.json({ status: 'success', user: { name: user.name, email: user.email, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.json({
            status: 'success',
            user: { name: user.name, email: user.email, username: user.username, role: user.role, picture: user.picture }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Forgot Password (OTP) ────────────────────────────────────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(`[Auth] Forgot Password requested for: ${email}`);
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.findOneAndUpdate(
            { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } },
            { resetOTP: otp, resetOTPExpires: otpExpires },
            { new: true }
        );

        if (!user) {
            console.log(`[Auth] User not found for: ${email}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`[Auth] OTP generated for ${email}. Attempting to send via hardcoded IPv4 SMTP...`);

        await transporter.sendMail({
            from: `"Viswa Vignana Vaaradhi" <${process.env.EMAIL || 'viswavignanavaaradi@gmail.com'}>`,
            to: email,
            subject: 'Your VVV Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #2e7d32;">Viswa Vignana Vaaradhi</h2>
                    <h3>Password Reset OTP</h3>
                    <p>You requested a password reset. Use the OTP below to proceed:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e65100; padding: 16px 0;">${otp}</div>
                    <p>This OTP expires in <strong>10 minutes</strong>.</p>
                    <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
                </div>
            `
        });

        console.log(`[Auth] OTP sent successfully to: ${email}`);
        res.json({ status: 'success', message: 'OTP sent to email' });
    } catch (err) {
        console.error(`[Auth Error] Failed to send OTP to ${email}:`, err.message);
        res.status(500).json({ error: `Failed to send OTP: ${err.message}` });
    }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
            resetOTP: otp,
            resetOTPExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
            resetOTP: otp,
            resetOTPExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ error: 'Session expired. Please try again.' });

        user.password = password; // Hash in production
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        res.json({ status: 'success', message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Contact Form ─────────────────────────────────────────────────────────────
app.post('/api/contact/submit', async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    try {
        console.log(`[Contact] Sending email from ${email}...`);
        await transporter.sendMail({
            from: `"VVV Contact Form" <${process.env.EMAIL || 'viswavignanavaaradi@gmail.com'}>`,
            to: process.env.EMAIL || 'viswavignanavaaradi@gmail.com',
            subject: `New Contact Message from ${firstName} ${lastName}`,
            html: `
                <h3>New message received via VVV Contact Form</h3>
                <p><b>From:</b> ${firstName} ${lastName} (${email})</p>
                <p><b>Message:</b></p>
                <p>${message}</p>
            `
        });
        console.log(`[Contact] Message sent successfully from ${email}`);
        res.json({ status: 'success' });
    } catch (err) {
        console.error('[Contact] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VVV API v${VERSION}] Server running on 0.0.0.0:${PORT}`);
});
const mongoose = require('mongoose');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Donation = require('./models/Donation');
const Subscription = require('./models/Subscription');
const LegalRequest = require('./models/LegalRequest');

const uri = process.env.MONGODB_URI;

async function initializeDatabase() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(uri, { dbName: 'vvv_ngo' });
        console.log('✅ Connected to Database: vvv_ngo');

        const collections = [
            { name: 'Users', model: User, data: { name: 'System Admin', email: 'admin@viswavignanavaaradhi.org' } },
            { name: 'Volunteers', model: Volunteer, data: { name: 'Initial Volunteer', email: 'volunteer@test.com', phone: '0000000000' } },
            { name: 'Donations', model: Donation, data: { name: 'First Donor', email: 'donor@test.com', amount: 1, transactionId: 'init_tx' } },
            { name: 'Subscriptions', model: Subscription, data: { name: 'First Patron', email: 'patron@test.com', amount: 1, razorpay_subscription_id: 'init_sub' } },
            { name: 'LegalRequests', model: LegalRequest, data: { name: 'First Request', email: 'legal@test.com', issue: 'Initialization' } }
        ];

        for (const col of collections) {
            console.log(`Creating collection: ${col.name}...`);
            const doc = await col.model.create(col.data);
            await col.model.deleteOne({ _id: doc._id });
            console.log(`✅ Collection ${col.name} initialized.`);
        }

        console.log('\n🌟 SUCCESS: All project collections have been initialized in Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR during initialization:', err.message);
        process.exit(1);
    }
}

initializeDatabase();

const mongoose = require('mongoose');
require('dotenv').config();

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

const Donation = mongoose.model('Donation', donationSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testDonation = {
            order_id: 'order_test_123',
            payment_id: 'pay_test_456',
            amount: 500,
            donor_name: 'Aravind (Test Patron)',
            email: 'neekuendukunaadhi@gmail.com',
            phone: '9515574466',
            certificate_id: 'CERT-TEST99',
            status: 'Success'
        };

        const existing = await Donation.findOne({ certificate_id: 'CERT-TEST99' });
        if (existing) {
            console.log('Test donation already exists.');
        } else {
            await Donation.create(testDonation);
            console.log('Test donation seeded successfully!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seed();

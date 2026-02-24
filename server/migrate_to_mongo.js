const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Donation = require('./models/Donation');

dotenv.config();

const db = new sqlite3.Database('./donations.db');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for migration...");

        // 1. Migrate Donations
        const donations = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM donations", [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        console.log(`Found ${donations.length} donations in SQLite.`);
        for (const d of donations) {
            await Donation.findOneAndUpdate(
                { order_id: d.order_id },
                {
                    order_id: d.order_id,
                    payment_id: d.payment_id,
                    amount: d.amount,
                    donor_name: d.donor_name,
                    email: d.email,
                    phone: d.phone,
                    certificate_id: d.certificate_id,
                    status: d.status,
                    date: new Date(d.date)
                },
                { upsert: true }
            );
        }
        console.log("Donations migrated.");

        // 2. Migrate Volunteers
        const volunteers = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM volunteers", [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        console.log(`Found ${volunteers.length} volunteers in SQLite.`);
        for (const v of volunteers) {
            await Volunteer.findOneAndUpdate(
                { email: v.email },
                {
                    fullName: v.full_name,
                    email: v.email,
                    age: v.age,
                    gender: v.gender,
                    phone: v.phone,
                    bloodGroup: v.blood_group,
                    state: v.state,
                    district: v.district,
                    college: v.college,
                    education: v.education,
                    wings: v.wings,
                    priorityWing: v.priority_wing,
                    interests: v.interests,
                    contributed: v.contributed === 1,
                    payment_id: v.payment_id,
                    date: new Date(v.date)
                },
                { upsert: true }
            );

            // Also ensure a User entry exists for each volunteer
            await User.findOneAndUpdate(
                { email: v.email },
                {
                    name: v.full_name,
                    email: v.email,
                    role: 'volunteer'
                },
                { upsert: true }
            );
        }
        console.log("Volunteers migrated.");

        console.log("Migration complete!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();

const mongoose = require('mongoose');
const LegalRequest = require('./models/LegalRequest');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const reqs = await LegalRequest.find({}, 'requestId status fullName');
        console.log('--- ALL REQUESTS ---');
        console.log(JSON.stringify(reqs, null, 2));

        const target = await LegalRequest.findOne({ requestId: /VVVLR0003/i });
        console.log('--- TARGET REQUEST (VVVLR0003) ---');
        if (target) {
            console.log('Found:', JSON.stringify(target, null, 2));
            console.log('Exact requestId length:', target.requestId.length);
            console.log('Char codes:', [...target.requestId].map(c => c.charCodeAt(0)));
        } else {
            console.log('VVVLR0003 NOT FOUND in DB');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

check();

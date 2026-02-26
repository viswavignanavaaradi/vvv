const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri ? uri.split('@')[1] : 'MISSING URI');

mongoose.connect(uri, { dbName: 'vvv_ngo' })
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log('Database Name:', mongoose.connection.name);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE: Could not connect to MongoDB.');
        console.error('Error Details:', err.message);
        if (err.message.includes('IP address')) {
            console.error('\nTIP: This looks like an IP Whitelist issue. Go to MongoDB Atlas -> Network Access and add your IP.');
        }
        process.exit(1);
    });

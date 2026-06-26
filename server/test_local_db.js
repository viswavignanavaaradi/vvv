const mongoose = require('mongoose');

const localUri = 'mongodb://127.0.0.1:27017/vvv_ngo';
console.log('Testing local MongoDB connection...');

mongoose.connect(localUri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to local MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE: Could not connect to local MongoDB.');
        console.error('Error:', err.message);
        process.exit(1);
    });

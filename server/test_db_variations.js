const mongoose = require('mongoose');

const variations = [
    'mongodb+srv://viswavignanavaaradi_db_user:lvncmYPYwZdFv3Aw@cluster0.e7my8yd.mongodb.net/vvv_ngo?appName=Cluster0',
    'mongodb+srv://viswavignanavaaradhi_db_user:lvncmYPYwZdFv3Aw@cluster0.e7my8yd.mongodb.net/vvv_ngo?appName=Cluster0',
];

async function test() {
    for (const uri of variations) {
        console.log('Testing URI:', uri.replace(/:[^@]+@/, ':****@'));
        try {
            const conn = await mongoose.connect(uri, { dbName: 'vvv_ngo', serverSelectionTimeoutMS: 5000 });
            console.log('✅ SUCCESS: Connected successfully!');
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.error('❌ FAILED:', err.message);
        }
    }
    process.exit(1);
}

test();

const mongoose = require('mongoose');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('[DNS] Failed to set public DNS servers:', e.message);
}

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

const mongoose = require('mongoose');

const adminConfigSchema = new mongoose.Schema({
    singleton: { type: String, default: 'admin_config', unique: true },
    totpSecret: { type: String },
    isTotpEnabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('AdminConfig', adminConfigSchema);

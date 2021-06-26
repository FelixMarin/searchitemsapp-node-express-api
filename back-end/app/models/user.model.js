const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    enabled: Boolean,
    account_non_expired: Boolean,
    account_non_locked: Boolean,
    role: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
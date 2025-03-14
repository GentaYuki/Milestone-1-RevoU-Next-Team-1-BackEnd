const mongoose = require('mongoose');

// Schema untuk User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

// Index untuk pencarian user
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

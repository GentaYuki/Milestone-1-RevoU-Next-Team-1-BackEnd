const mongoose = require('mongoose');

// Schema untuk Review
const reviewSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review_text: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String // URL gambar/video dari ImageKit
    }],
    helpful_count: {
        type: Number,
        default: 0
    },
    user_measurements: {
        waist: { type: Number, required: true },
        bust: { type: Number, required: true },
        hips: { type: Number, required: true },
        height: { type: Number, required: true }
    }
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

// Index untuk meningkatkan performa query
reviewSchema.index({ product_id: 1, created_at: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ helpful_count: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

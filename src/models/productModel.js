const mongoose = require('mongoose');

// Schema untuk Product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    review_count: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

// Index untuk optimasi query
productSchema.index({ name: 1 });
productSchema.index({ review_count: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

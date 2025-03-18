const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        enum: ['veg', 'non-veg']
    }],
    image: {
        type: String
    },
    bestSeller: {
        type: Boolean
    },
    description: {
        type: String
    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }]
});

// ✅ Check if the model exists before defining it to prevent OverwriteModelError
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;

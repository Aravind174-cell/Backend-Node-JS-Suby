const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: [{
        type: String // ✅ Removed enum to allow flexibility
    }],
    region: [{
        type: String // ✅ Removed enum for flexibility
    }],
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: { // ✅ FIXED: Vendor should be a single ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    products: [{ // ✅ FIXED: Renamed from 'product' to 'products'
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});

const Firm = mongoose.model("Firm", firmSchema);
module.exports = Firm;

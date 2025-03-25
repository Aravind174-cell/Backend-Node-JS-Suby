const express = require("express");
const vendorController = require("../controllers/vendorController");

const router = express.Router();

// Vendor Registration & Login
router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);

// Fetch Vendors
router.get('/all-vendors', vendorController.getAllVendors);

// 🔥 FIX: Use ':vendorId' instead of ':apple'
router.get('/single-vendor/:vendorId', vendorController.getVendorById);

module.exports = router;

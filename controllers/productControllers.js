const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/Firm");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Destination folder for image uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// 🟢 Add Product Function
const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const firmId = req.params.firmId;

        // ✅ Check if firm exists
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ success: false, message: "Firm not found" });
        }

        // ✅ Create new product
        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        });

        // ✅ Save product
        const savedProduct = await product.save();

        // ✅ Ensure products array exists before pushing
        if (!firm.products) {
            firm.products = [];
        }
        firm.products.push(savedProduct._id);
        await firm.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 🟢 Get Products by Firm
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId).populate("products");

        if (!firm) {
            return res.status(404).json({ success: false, message: "Firm not found" });
        }

        const restaurantName = firm.firmName;
        res.status(200).json({ success: true, restaurantName, products: firm.products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 🟢 Delete Product by ID
const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        // ✅ Find the product first
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ✅ Remove product reference from firm
        await Firm.updateOne(
            { _id: product.firm },
            { $pull: { products: productId } }
        );

        // ✅ Delete the product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Exporting functions with multer middleware
module.exports = {
    addProduct: [upload.single("image"), addProduct],
    getProductByFirm,
    deleteProductById
};

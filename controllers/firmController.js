const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
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

// 🟢 Add Firm Function
const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const vendorId = req.params.vendorId; // Ensure vendorId is passed from frontend

        // ✅ Check if vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        // ✅ Vendor can have only one firm
        if (vendor.firm) {
            return res.status(400).json({ success: false, message: "Vendor can have only one firm" });
        }

        // ✅ Create new firm
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        // ✅ Save firm to DB
        const savedFirm = await firm.save();

        // ✅ Associate the firm with the vendor
        vendor.firm = savedFirm._id;
        await vendor.save();

        res.status(201).json({
            success: true,
            message: "Firm added successfully",
            firmId: savedFirm._id,
            vendorFirmName: savedFirm.firmName
        });

    } catch (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 🟢 Delete Firm By ID
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        // ✅ Find the firm before deleting
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ success: false, message: "Firm not found" });
        }

        // ✅ Remove firm reference from Vendor
        await Vendor.updateOne({ firm: firmId }, { $unset: { firm: "" } });

        // ✅ Delete the firm
        await Firm.findByIdAndDelete(firmId);

        res.status(200).json({ success: true, message: "Firm deleted successfully" });

    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Exporting functions with multer middleware
module.exports = {
    addFirm: [upload.single("image"), addFirm],
    deleteFirmById
};

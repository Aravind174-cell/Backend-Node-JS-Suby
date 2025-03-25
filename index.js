const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

dotEnv.config();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log(error));

// ✅ Serve Static Files (Uploads)
app.use("/uploads", express.static("uploads"));

// ✅ Define API Routes First
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

// ✅ Homepage Route (Keep this **at the end**)
app.get("/", (req, res) => {
  res.send("<h1> Welcome to SUBY</h1>");
});

// ✅ Catch-All for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server started and running at ${PORT}`);
});

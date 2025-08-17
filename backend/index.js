const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initializeConnections } = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware - place BEFORE routes
app.use((req, res, next) => {
  // remove password from the request body for security
  if (req.body) {
    delete req.body.password;
  }
  if (req.query) {
    delete req.query.password;
  }
  if (req.params) {
    delete req.params.password;
  }

  // Enhanced logging with timestamp and request details
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  // console.log("Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Request Query:", JSON.stringify(req.query, null, 2));
  console.log("Request IP:", req.ip);

  next();
});

// Import routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/airTable", blogRoutes);
app.use("/api/contact", contactRoutes);

// Serve static files from public directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Serve static files if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error Middleware - place AFTER all routes
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    await initializeConnections();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

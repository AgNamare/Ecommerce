import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import bodyParser from "body-parser";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.route.js";
import admUserRoutes from "./routes/admUser.route.js";
import homeRoutes from "./routes/home.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import logisticsRoutes from "./routes/logistics.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ecom-frontend-7ymd.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const __dirname = path.resolve();

// API Routes
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/products", productRoutes);
app.use("/api/v1/admin/users", admUserRoutes);
app.use("/api/v1/admin/category", categoryRoutes);
app.use("/api/v1/admin/logistics", logisticsRoutes);
app.use("/api/v1/admin/orders", orderRoutes);
app.use("/api/v1/products", homeRoutes);
app.use("/api/v1", homeRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/orders", orderRoutes);

// Serve static assets
app.use("/admin", express.static(path.join(__dirname, "..", "public", "admin")));
app.use("/app", express.static(path.join(__dirname, "..", "public", "app")));

// Admin panel routing
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "index.html"));
});

// Client app routing
app.get("/app/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "app", "index.html"));
});



// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import contentRoutes from "./routes/contentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();

const FRONTEND_URL =
	process.env.NODE_ENV === "production"
		? "https://eroticverseweb.onrender.com" // ✅ Production Frontend URL
		: "http://localhost:3001"; // ✅ Dev Frontend URL

const port = process.env.PORT || 5000;

// Fix Mongoose warning
mongoose.set("strictQuery", true);

app.use(helmet()); // ✅ Blocks XSS and security vulnerabilities

// Middleware
app.use(
	cors({
		origin: FRONTEND_URL, // ✅ Allow frontend requests
		credentials: true, // ✅ Allow cookies & sessions
		methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow these methods
		allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow headers
	})
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("✅ Connected to MongoDB Atlas"))
	.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Limit login attempts (Max 5 per 15 minutes)
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 attempts per IP
	message: "Too many login attempts. Try again later.",
});
app.use("/api/admin/login", loginLimiter);
// ✅ Use Admin Authentication Routes
app.use("/api/admin", adminRoutes);

// ✅ Use Content Routes
app.use("/api/content", contentRoutes);

app.listen(port, () => {
	console.log(`🚀 Server running on port ${port}`);
});

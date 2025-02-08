import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import contentRoutes from "./routes/contentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Fix Mongoose warning
mongoose.set("strictQuery", true);

// Middleware
app.use(
	cors({
		origin: "http://localhost:3001",
		credentials: true, // ✅ Allow cookies to be sent
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

// ✅ Use Admin Authentication Routes
app.use("/api/admin", adminRoutes);

// ✅ Use Content Routes
app.use("/api/content", contentRoutes);

app.listen(port, () => {
	console.log(`🚀 Server running on port ${port}`);
});

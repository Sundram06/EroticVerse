import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();
// ✅ Hardcoded Admin Credentials (Replace in Production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const HASHED_PASSWORD = process.env.ADMIN_PASSWORD;

// ✅ Admin Authentication Check Route (GET /api/admin/check)
router.get("/check", (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(403).json({ error: "Unauthorized" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}
		res.json({ message: "Admin authenticated" });
	});
});

// ✅ Admin Login Route (POST /api/admin/login)
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		// ✅ Log stored credentials for debugging
		console.log("📥 Login attempt:", { username, password });
		console.log("🔍 Stored Username:", ADMIN_USERNAME); // Log stored username

		// ✅ Check if username matches
		if (username.trim() !== ADMIN_USERNAME.trim()) {
			console.log("❌ Invalid username (Input does not match stored value)");
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// ✅ Compare provided password with hashed password
		const isMatch = await bcrypt.compare(password, HASHED_PASSWORD);
		if (!isMatch) {
			console.log("❌ Invalid password");
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// ✅ Generate JWT token
		const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// ✅ Store token in a **secure** HTTP-only cookie
		res.cookie("admin_token", token, {
			httpOnly: true, // ✅ Prevents access via JavaScript (stops XSS attacks)
			secure: process.env.NODE_ENV === "production", // ✅ Works only over HTTPS in production
			sameSite: "Strict", // ✅ Prevents CSRF attacks
			maxAge: 60 * 60 * 1000, // ✅ 1 hour expiration
		});
		console.log("✅ Login successful!");
		res.json({ message: "Login successful!" });
	} catch (err) {
		console.error("❌ Login error:", err.message);
		res.status(500).json({ error: "Server error. Could not log in." });
	}
});


// ✅ Admin Logout Route (POST /api/admin/logout)
router.post("/logout", (req, res) => {
	res.clearCookie("token");
	return res.json({ message: "Logged out successfully" });
});

// ✅ Verify Admin Middleware
export const verifyAdmin = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(403).json({ error: "Unauthorized" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}
		req.isAdmin = decoded.isAdmin;
		next();
	});
};

export default router;

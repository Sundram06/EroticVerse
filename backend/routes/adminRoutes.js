import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

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

// ✅ Hardcoded Admin Credentials (Replace in Production)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "EVAdmin@123";

// ✅ Admin Login Route (POST /api/admin/login)
router.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("token", token, { httpOnly: true, secure: false }); // ✅ Store token in cookies
		return res.json({ message: "Login successful!" });
	}

	res.status(401).json({ error: "Invalid credentials" });
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

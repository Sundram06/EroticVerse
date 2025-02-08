import express from "express";
import Content from "../models/Content.js";
import { verifyAdmin } from "./adminRoutes.js";

const router = express.Router();

//get all stories
router.get("/", async (req, res) => {
	try {
		const contents = await Content.find().sort({ createdAt: -1 }); // Fetch latest stories first
		console.log("📤 Sending stories to frontend:", contents);
		res.json(contents);
	} catch (err) {
		console.error("❌ Error fetching content:", err);
		res.status(500).json({ error: "Failed to fetch stories" });
	}
});

// ✅ Delete a Story (Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
	try {
		const { id } = req.params;
		const deletedStory = await Content.findByIdAndDelete(id);

		if (!deletedStory) {
			return res.status(404).json({ error: "Story not found" });
		}

		console.log(`🗑️ Deleted story: ${id}`);
		res.json({ message: "Story deleted successfully!" });
	} catch (err) {
		console.error("❌ Error deleting story:", err);
		res.status(500).json({ error: "Failed to delete story" });
	}
});

// ✅ Search Stories by Multiple Tags
router.get("/search", async (req, res) => {
	try {
		const { tags } = req.query;
		console.log("📥 Received search request for tags:", tags);

		if (!tags) {
			console.log("❌ No tags provided.");
			return res.status(400).json({ error: "No tags provided for search." });
		}

		// ✅ Convert tags into an array
		const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
		console.log("🔎 Searching for stories with tags:", tagArray);

		// ✅ Find stories that contain **ALL** searched tags
		const stories = await Content.find({ tags: { $all: tagArray } });

		console.log("✅ Stories found:", stories.length);
		res.json(stories);
	} catch (err) {
		console.error("❌ Error fetching search results:", err.message);
		res.status(500).json({
			error: "Server error. Could not fetch story.",
			details: err.message,
		});
	}
});

// ✅ Get a Single Story by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const story = await Content.findById(id);

		if (!story) {
			return res.status(404).json({ error: "Story not found" });
		}

		res.json(story);
	} catch (err) {
		console.error("❌ Error fetching story:", err);
		res.status(500).json({ error: "Server error. Could not fetch story." });
	}
});

// ✅ Create new story with tags
router.post("/", async (req, res) => {
	try {
		console.log("📨 Received request:", req.body); // Debug log
		const { title, body, tags } = req.body;

		if (!title || !body) {
			return res.status(400).json({ error: "Title and body are required" });
		}

		const newStory = new Content({
			title,
			body,
			tags: tags || [], // Ensure tags are always an array
		});

		const savedStory = await newStory.save();
		console.log("✅ Story saved to database:", savedStory);

		res
			.status(201)
			.json({ message: "Story created successfully!", story: savedStory });
	} catch (err) {
		console.error("❌ Error saving story:", err);
		res.status(500).json({ error: "Server error. Could not save story." });
	}
});

export default router;

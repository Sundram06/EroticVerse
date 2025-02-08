import React, { useState } from "react";
import axios from "axios";

function ContentForm({ onNewContent }) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [tags, setTags] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		// ✅ Convert comma-separated tags into an array
		const tagArray = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag !== "");

		try {
			const response = await axios.post("http://localhost:5000/api/content", {
				title,
				body,
				tags: tagArray,
			});

			console.log("✅ Story submitted, response:", response.data); // Debugging log

			setLoading(false);
			setMessage("✅ Story submitted successfully!");

			if (typeof onNewContent === "function") {
				onNewContent(); // ✅ Call parent function
			} else {
				console.warn("⚠️ onNewContent is not a function.");
			}
			// ✅ Ask if the admin wants to add another story
			const addAnother = window.confirm(
				"Story added! Do you want to add another?"
			);
			if (!addAnother) {
				window.location.href = "/"; // ✅ Redirect to homepage
			} else {
				setTitle("");
				setBody("");
				setTags("");
			}
		} catch (error) {
			setLoading(false);
			setMessage("❌ Error: Could not submit story.");
			console.error("❌ Submission error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4">
			<h2>Create New Story</h2>
			{message && <p className="alert alert-info">{message}</p>}

			<div className="mb-3">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					type="text"
					id="title"
					className="form-control"
					placeholder="Enter title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="body" className="form-label">
					Body
				</label>
				<textarea
					id="body"
					className="form-control"
					placeholder="Enter content"
					value={body}
					onChange={(e) => setBody(e.target.value)}
					required
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="tags" className="form-label">
					Tags (comma separated)
				</label>
				<input
					type="text"
					id="tags"
					className="form-control"
					placeholder="e.g., romance, fantasy, adventure"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>
			</div>

			<button type="submit" className="btn btn-primary" disabled={loading}>
				{loading ? "Submitting..." : "Submit Story"}
			</button>
		</form>
	);
}

export default ContentForm;

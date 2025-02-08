import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContentList from "./components/ContentList";
import AdminPanel from "./components/AdminPanel";
import StoryPage from "./components/StoryPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import API_BASE_URL from "./api";
function Home() {
	const [contents, setContents] = useState([]);
	const [selectedTag, setSelectedTag] = useState("");
	const [searchTags, setSearchTags] = useState(""); // ✅ Store search input
	const navigate = useNavigate();

	// ✅ Fetch content from the backend
	const fetchContents = async (tag = "") => {
		try {
			const endpoint = tag
				? `${API_BASE_URL}/api/content/tag/${tag}`
				: `${API_BASE_URL}/api/content`; // Ensure full API URL
			const res = await axios.get(endpoint);
			setContents(res.data);
		} catch (err) {
			console.error("❌ Error fetching content:", err);
		}
	};

	// ✅ Fetch content when component loads & when selectedTag changes
	useEffect(() => {
		fetchContents(selectedTag);
	}, [selectedTag]);

	// ✅ Handle search for multiple tags
	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchTags.trim()) {
			alert("Please enter at least one tag to search.");
			return;
		}

		try {
			// ✅ Log the request URL to verify it's correct
			const encodedTags = encodeURIComponent(searchTags);
			const requestUrl = `${API_BASE_URL}/api/content/search?tags=${encodedTags}`;
			console.log("🔎 Sending request to:", requestUrl);

			const response = await axios.get(requestUrl);
			console.log("✅ Search results received:", response.data);

			setContents(response.data);
		} catch (error) {
			console.error(
				"❌ Error fetching search results:",
				error.response?.data || error
			);
			alert("Failed to fetch search results.");
		}
	};

	// ✅ Handle tag filtering
	const handleTagFilter = (tag) => {
		setSelectedTag(tag);
	};

	// ✅ Refresh content after a new story is added
	const handleNewContent = () => {
		fetchContents(selectedTag);
		navigate("/"); // ✅ Use React Router instead of window.location.href
	};

	// ✅ Remove deleted story from UI
	const handleDeleteStory = (id) => {
		setContents((prevContents) =>
			prevContents.filter((content) => content._id !== id)
		);
	};

	return (
		<div className="container my-4">
			<h1 className="eroticverse-header">EroticVerse</h1>

			{/* ✅ Single Search Bar for Multi-Tag Search */}
			<form onSubmit={handleSearch} className="mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Search by tags (comma separated)..."
					value={searchTags}
					onChange={(e) => setSearchTags(e.target.value)}
				/>
				<button type="submit" className="btn btn-primary mt-2">
					Search
				</button>
			</form>

			{/* ✅ List of Stories */}
			<ContentList
				contents={contents}
				setContents={setContents}
				onTagClick={handleTagFilter}
				onDeleteStory={handleDeleteStory}
			/>

			<hr />
			<p>
				Want to add a new story?{" "}
				<Link to="/admin" className="text-decoration-none">
					Admin Panel
				</Link>
			</p>
		</div>
	);
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route
				path="/admin"
				element={<AdminPanel onNewContent={() => navigate("/")} />}
			/>
			<Route path="/story/:id" element={<StoryPage />} /> {/* ✅ New Route */}
		</Routes>
	);
}
export default App;

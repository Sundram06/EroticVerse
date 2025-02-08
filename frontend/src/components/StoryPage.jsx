import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../api";
function StoryPage() {
	const { id } = useParams();
	const [story, setStory] = useState(null);
	const [loading, setLoading] = useState(true);

	// ✅ Fetch Story from Backend
	useEffect(() => {
		const fetchStory = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}/api/content/${id}`);
				setStory(res.data);
				setLoading(false);
			} catch (err) {
				console.error("❌ Error fetching story:", err);
				setLoading(false);
			}
		};
		fetchStory();
	}, [id]);

	if (loading) return <p>Loading story...</p>;
	if (!story) return <p>Story not found.</p>;

	return (
		<div className="container my-4">
			<Link to="/" className="btn btn-outline-secondary mb-3">
				⬅ Back to Home
			</Link>
			<h1>{story.title}</h1>
			<div className="mb-3">
				{story.tags?.map((tag, index) => (
					<span key={index} className="badge bg-secondary me-1">
						#{tag}
					</span>
				))}
			</div>
			<p className="story-content">{story.body}</p>
		</div>
	);
}

export default StoryPage;

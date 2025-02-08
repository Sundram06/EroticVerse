import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../api";
function ContentList({ contents, setContents, onTagClick, onDeleteStory }) {
	const [isAdmin, setIsAdmin] = useState(false);

	// ✅ Check if the user is an admin (JWT authentication)
	useEffect(() => {
		const checkAdmin = async () => {
			try {
				await axios.get(`${API_BASE_URL}/api/admin/check`, {
					withCredentials: true,
				});
				setIsAdmin(true);
			} catch (error) {
				setIsAdmin(false);
			}
		};
		checkAdmin();
	}, []);

	// ✅ Handle Delete Story (Only for Admins)
	const handleDelete = async (id) => {
		if (!isAdmin) {
			alert("You must be an admin to delete this story.");
			return;
		}

		if (window.confirm("Are you sure you want to delete this story?")) {
			try {
				await axios.delete(`${API_BASE_URL}/api/content/${id}`, {
					withCredentials: true,
				});
				onDeleteStory(id); // ✅ Remove story from UI after successful deletion
			} catch (error) {
				alert("Failed to delete the story.");
			}
		}
	};

	return (
		<div>
			<h2>Content List</h2>

			{/* ✅ Display message if no stories are available */}
			{contents.length === 0 ? (
				<p className="alert alert-info">No stories available. Add a new one!</p>
			) : (
				contents.map((content) => (
					<div key={content._id} className="card mb-3">
						<div className="card-body">
							{/* ✅ Title is now a link to its own page */}
							<h3 className="card-title">
								<Link
									to={`/story/${content._id}`}
									className="text-decoration-none"
								>
									{content.title}
								</Link>
							</h3>

							{/* ✅ Tags Section */}
							<div className="mt-2">
								{content.tags.map((tag, index) => (
									<span
										key={index}
										onClick={() => onTagClick(tag)}
										className="badge bg-secondary me-1"
										style={{ cursor: "pointer" }}
									>
										#{tag}
									</span>
								))}
							</div>

							{/* ✅ Delete Button (Only Visible to Admin) */}
							{isAdmin && (
								<button
									className="btn btn-danger btn-sm mt-2"
									onClick={() => handleDelete(content._id)}
								>
									Delete Story
								</button>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default ContentList;

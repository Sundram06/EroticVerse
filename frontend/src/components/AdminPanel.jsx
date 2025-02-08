import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ContentForm from "./ContentForm";

function AdminPanel({ onNewContent }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	// ✅ Check if admin is already logged in (JWT stored in cookies)
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/admin/check", { withCredentials: true })
			.then(() => setAuthenticated(true))
			.catch(() => setAuthenticated(false));
	}, []);

	// ✅ Handle Login
	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/admin/login",
				{ username: "admin", password },
				{ withCredentials: true }
			);

			alert(response.data.message); // ✅ Show success message
			setAuthenticated(true);
		} catch (error) {
			alert(error.response?.data?.error || "Login failed!");
		}
	};

	// ✅ Handle Logout
	const handleLogout = async () => {
		await axios.post(
			"http://localhost:5000/api/admin/logout",
			{},
			{ withCredentials: true }
		);
		setAuthenticated(false);
		navigate("/");
	};

	// ✅ Show Login Form if Not Authenticated
	if (!authenticated) {
		return (
			<div className="container my-4">
				<h2>Admin Login</h2>
				<form onSubmit={handleLogin}>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							id="password"
							className="form-control"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Login
					</button>
				</form>
			</div>
		);
	}

	// ✅ Show Admin Panel if Authenticated
	return (
		<div className="container my-4">
			<h2>Admin Panel</h2>
			<button className="btn btn-danger mb-3" onClick={handleLogout}>
				Logout
			</button>
			<ContentForm />
			<p className="mt-2">
				<a href="/" className="text-decoration-none">
					Return to Homepage
				</a>
			</p>
		</div>
	);
}

export default AdminPanel;

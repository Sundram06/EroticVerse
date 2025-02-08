const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL // ✅ Use Render backend in production
		: process.env.REACT_APP_DEV_API_URL; // ✅ Use localhost in development

export default API_BASE_URL;

const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? "https://eroticverse.onrender.com" // ✅ Use Render backend in production
		: "http://localhost:5000"; // ✅ Use localhost in development

console.log(API_BASE_URL);
export default API_BASE_URL;

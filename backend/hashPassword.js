import bcrypt from "bcryptjs";

const plainPassword = "EVAdmin@123"; // Replace this with your actual password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
	if (err) throw err;
	console.log("Hashed Password:", hash);
});

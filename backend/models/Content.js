import { Schema, model } from "mongoose";

const ContentSchema = new Schema(
	{
		title: { type: String, required: true },
		body: { type: String, required: true },
		tags: [String], // Array of tag strings
		createdAt: { type: Date, default: Date.now },
	},
	{ collection: "stories" }
);

export default model("Content", ContentSchema);

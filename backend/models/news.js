const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
	headline: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	subHeadline: {
		type: String,
		trim: true,
	},
	author: {
		type: String,
		index: true,
		trim: true,
		lowercase: true,
	},
	category: {
		type: String,
		index: true,
		trim: true,
		lowercase: true,
	},
	url: {
		type: String,
		unique: true,
		required: true,
	},
	screenshot: {
		type: String,
	},
	source: {
		type: String,
		required: true,
		enum: ["fox", "cnn"],
	},
});

module.exports = mongoose.Model("Article", ArticleSchema);

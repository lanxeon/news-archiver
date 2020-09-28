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
		index: true,
	},
	timestamp: {
		type: Date,
		index: true,
		required: true,
		default: Date.now(),
	},
});

ArticleSchema.index({ timestamp: 1, source: 1, headline: 1, author: 1, category: 1 });

module.exports = mongoose.Model("Article", ArticleSchema);

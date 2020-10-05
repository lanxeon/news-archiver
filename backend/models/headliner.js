const mongoose = require("mongoose");

const HeadlinerSchema = new mongoose.Schema({
	headline: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	url: {
		type: String,
		// unique: true,
		// required: true,
	},
	screenshotDark: {
		type: String,
		trim: true,
	},
	screenshotLight: {
		type: String,
		trim: true,
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

module.exports = mongoose.model("Headliner", HeadlinerSchema);

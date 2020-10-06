const mongoose = require("mongoose");

const HeadlinerSchema = new mongoose.Schema({
	headline: {
		type: String,
		required: true,
		index: true,
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

HeadlinerSchema.index({ timestamp: 1, source: 1, headline: 1 });
// HeadlinerSchema.index({ source: 1, headline: 1 });

// HeadlinerSchema.pre("save", async function (next) {
// 	const Headliner = mongoose.model("Headliner");

// 	let exists = await Headliner.countDocuments({
// 		source: this.source,
// 		headline: this.headline,
// 		_id: { $ne: this._id },
// 	});

// 	if (exists > 0) throw new Error(`${this.source} headline: ${this.headline} already exists. Skip`);
// });

module.exports = mongoose.model("Headliner", HeadlinerSchema);

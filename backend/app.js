const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//router imports

//starting the database and then start the CRON job inside it
require("./config/database-cron");

//database models
const Headliner = require("./models/headliner");
const Article = require("./models/article");

//creating an express app
const app = express();

//body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for parsing cookies
app.use(cookieParser());

//static directory for retrieving uploaded files
app.use("/static", express.static(path.join(__dirname, "uploads")));

//For enabling CORS
app.use(cors());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Server is up and running just fine",
	});
});

app.get("/carousel-headlines", async (req, res, next) => {
	try {
		let [foxHeadlines, cnnHeadlines] = await Promise.all([
			Headliner.find({ source: "fox" }).sort("-timestamp").limit(3),
			Headliner.find({ source: "cnn" }).sort("-timestamp").limit(3),
		]);

		let result = [];

		for (let i = 0; i < foxHeadlines.length; i++) {
			result.push(foxHeadlines[i]);
			result.push(cnnHeadlines[i]);
		}

		return res.status(200).json({
			message: "Successfully retrieved latest archived articles",
			payload: result,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Something went wrong!" });
	}
});

//router implementations

module.exports = app;

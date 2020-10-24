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

app.get("/content/:dateString", async (req, res) => {
	try {
		let dateString = req.params.dateString.trim();

		//make sure date is in required format, otherwise throw error
		if (!/^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/.test(dateString))
			return res.status(400).json({
				message: "Invalid date. Accepted format for dates => dd-mm-yyyy",
			});

		//extract the day, month and year from the date string by splitting on "-"
		let [day, month, year] = dateString.split("-");
		//convert the acquired strings into numbers
		day = +day;
		month = +month - 1; //reduce by 1 in order to do 0 indexing on month(required by Date constructor)
		year = +year;

		//get lower bound date and upper bound date respectively, for the range of 1 day
		let date1 = new Date(Date.UTC(year, month, day));
		let date2 = new Date(Date.UTC(year, month, day + 1));

		console.log({ date1, date2 });

		//headlines and articles to be returned
		const headliners = await Headliner.find({
			timestamp: { $gt: date1.toISOString(), $lt: date2.toISOString() },
		}).sort("timestamp");
		const articles = await Article.find({
			timestamp: { $gt: date1.toISOString(), $lt: date2.toISOString() },
		}).sort("timestamp");

		return res.status(200).json({ headliners, articles });
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Something went wrong!",
			error: err,
		});
	}
});

//router implementations

module.exports = app;

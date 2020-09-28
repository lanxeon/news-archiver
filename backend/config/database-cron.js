const mongoose = require("mongoose");

//get the database connection URI from the environment variable
const DB_URI = process.env.DATABASE_URI;

//connecting to database
const connectToMongoose = async () => {
	try {
		await mongoose.connect(DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log("mongoDB connection: SUCCESS");

		//start the CRON job after connecting to the database
		require("../services/taskRunner");
	} catch (e) {
		console.log("mongoDB connection: FAIL");
		console.log("reason: " + e);
	}
};

connectToMongoose();

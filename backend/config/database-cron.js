const mongoose = require("mongoose");

//get the database connection URI from the environment variable
const DB_URI = process.env.DATABASE_URI;

//connecting to database
const connectToMongoose = async () => {
	let connectionisSuccessful = false;
	try {
		await mongoose.connect(DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		connectionisSuccessful = true;
		console.log("mongoDB connection: SUCCESS");
	} catch (e) {
		console.log("mongoDB connection: FAIL");
		console.log("reason: " + e);
	}
	//start the CRON job after connecting to the database (if in production server)
	if (process.env.NODE_ENV !== "development") {
		connectionisSuccessful ? require("../services/taskRunner") : console.log("CANNOT RUN CRON JOB");
	}
};

connectToMongoose();

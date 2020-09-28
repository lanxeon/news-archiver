const mongoose = require("mongoose");

//get the database connection URI from the environment variable
const DB_URI = process.env.DATABASE_URI;

//connecting to database
mongoose
	.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	}) //currently using local db for development
	.then(() => {
		console.log("mongoDB connection to [" + DB_URI + "] successful");
	})
	.catch(() => {
		console.log("mongoDB connection to [" + DB_URI + "] failed");
	});

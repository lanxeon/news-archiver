const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//router imports

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

//router implementations

module.exports = app;

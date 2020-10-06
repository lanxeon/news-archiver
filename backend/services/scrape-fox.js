const puppeteer = require("puppeteer");
const aws = require("aws-sdk"); //AWS SDK, to use the S3 bucket

//article and headliner models
const Article = require("../models/article");
const Headliner = require("../models/headliner");

//to configure the credentials for the S3 bucket
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});
//create s3 object in order to upload to an S3 bucket
const s3 = new aws.S3();
//bucket name and region
const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;

//constants

//regex pattern to escape certain characters in a path
const regexPattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

const defaultBucketParams = {
	Bucket: bucket,
	Metadata: { "Content-Type": "image/jpeg" },
	ContentType: "image/jpeg",
};

//function to convert a page to dark mode
const convertPageToDarkMode = async (page) => {
	//insert CSS stylings to convert site into dark mode, and then take dark mode screenshot
	await page.addStyleTag({
		content: `* {
            color: #eeeeee !important;
            background-color: #222831 !important;
            border-color: #222831 !important;
        }`,
	});
};

const scrapeFox = async () => {
	// open browser
	const browser =
		process.env.NODE_ENV == "development"
			? await puppeteer.launch({ headless: true })
			: await puppeteer.launch({
					executablePath: "/usr/bin/google-chrome-stable",
					headless: true,
					args: ["--no-sandbox", "--disable-setuid-sandbox"],
			  });
	try {
		//open a new page on the browser
		const page = await browser.newPage();
		//set width to 800px and height to 1560px (perfect width and height for both fox and CNN)
		await page.setViewport({
			height: 1560,
			width: 800,
		});

		//go to the fox news US URL
		await page.goto("https://www.foxnews.com", { waitUntil: "domcontentloaded", timeout: 0 });

		// //screenshot the main page: *not needed*
		// await page.screenshot({ path: "./static/latest-fox.jpg", fullPage: true });

		//page.evaluate lets us access the DOM elements of the page such as
		//accessing the "document" object and performing query selectors, etc, and the return value is stored in "data"
		const data = await page.evaluate(() => {
			//first just scrape the headline
			let headline = document.querySelector("main.main-content  div.content h2.title a").innerText;

			//scrape the URLS from the spotlight section
			//make a set instead of array to get rid of duplicate anchor tags
			let urls = new Set(
				[...document.querySelectorAll(".collection-spotlight .info a")].map((a) => a.href)
			);

			//return the array(or rather set) of URLS as well as the main headline in an object
			return { headline, urls: [...urls] };
		});

		const { headline, urls } = data;
		console.log(urls);

		//now add main page into the headlines section
		try {
			let headlinerExists = await Headliner.countDocuments({ source: "fox", headline: headline });

			//if headline is already archivedm just skip, else, screenshot the page and add it to the database
			if (headlinerExists > 0)
				throw new Error(`[Fox] => Headline "${headline}" already exists. Skipping...`);
			else {
				//screenshot the main page(light)
				let lsb = await page.screenshot();
				//convert page to dark mode
				await convertPageToDarkMode(page);
				//take dark mode screenshot
				let dsb = await page.screenshot();

				//generic name
				let name = headline.toLowerCase().split(" ").join("-") + "-" + Date.now();
				//light and dark mode names
				let lname = name + "-light" + ".jpg";
				let dname = name + "-dark" + ".jpg";

				//upload to bucket

				//light bucket parameters
				let lightParams = { ...defaultBucketParams, Key: lname, Body: lsb };
				//dark bucket parameters
				let darkParams = { ...defaultBucketParams, Key: dname, Body: dsb };

				await s3.putObject(lightParams).promise();
				await s3.putObject(darkParams).promise();

				//acquire link of newly uploaded screenshot
				const lightScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${lname}`;
				const darkScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${dname}`;

				let newHeadliner = new Headliner({
					headline: headline,
					screenshotDark: darkScreenshotURL,
					screenshotLight: lightScreenshotURL,
					source: "fox",
					timestamp: Date.now(),
				});

				await newHeadliner.save();
				console.log("[Fox] => Archived new headliner main page");
			}
		} catch (err) {
			console.log(err);
		}

		//iterate through the array of articles and their URL(and category+timestamp) returned in `data`
		for (let url of urls) {
			try {
				//ignore if it is a video article
				// if (url.includes("/videos/")) return; // this is supposed to be for fox
				if (url.startsWith("https://video")) return;
				//check if URL of article already exists in database. If yes, ignore the article
				try {
					let articleExists = await Article.countDocuments({ url: url });
					if (articleExists > 0) throw new Error(`Article ${url} already exists`);
				} catch (err) {
					throw err;
				}

				//extract the URL, timestamp and category
				let timestamp = new Date();

				//normalize name by escaping the characters in the REGEX, in order to have a file name
				let name =
					url
						.slice("https://foxnews.com/".length, url.length)
						.replace(regexPattern, " ")
						.toLowerCase()
						.split(" ")
						.join("-") + ".jpg"; //and adding the jpg extension

				//dark mode and light mode screenshot names
				let darkName = "dark-" + name;
				let lightName = "light-" + name;

				//visit the URL for the article, and take a full page screenshot of the page
				await page.goto(url, {
					waitUntil: "domcontentloaded",
					timeout: 0,
				});

				//take a screenshot of the full page, and store the Buffer in `screenshotBuffer`, to write to S3 bucket
				let lightScreenshotBuffer = await page.screenshot({ fullPage: true });
				//convert page to dark mode
				await convertPageToDarkMode(page);
				//take dark mode screenshot
				let darkScreenshotBuffer = await page.screenshot({ fullPage: true });

				//setting the parameters for uploading to the bucket, and then uploading screenshot with putObject() using the params
				const bucketParamsLight = {
					...defaultBucketParams,
					Key: lightName,
					Body: lightScreenshotBuffer,
				};
				const bucketParamsDark = {
					...defaultBucketParams,
					Key: darkName,
					Body: darkScreenshotBuffer,
				};

				await s3.putObject(bucketParamsLight).promise();
				await s3.putObject(bucketParamsDark).promise();

				//acquire link of newly uploaded screenshot
				const lightScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${lightName}`;
				const darkScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${darkName}`;

				//use page.evaluate() again in order to scrape the html content of the page and return it to `articleData`
				const articleData = await page.evaluate(() => {
					//scrape the headline, subheadline and author fields
					let headline = document.querySelector("h1");
					let subHeadline = document.querySelector("h2");
					// let author = document.querySelector("div.author-byline > span > span > a");
					let category = document.querySelector("div.eyebrow a");
					let time = document.querySelector("div.article-date time");
					let authors = document.querySelectorAll("div.author-byline span a");

					//sometimes, one or more of the fields are null, so need to ensure that we only access innerHTML if the DOM element exists
					headline = headline ? headline.innerHTML.trim() : null;
					subHeadline = subHeadline ? subHeadline.innerHTML.trim() : null;
					// author = author ? author.innerHTML.trim() : null;
					category = category ? category.innerText.trim().toLowerCase() : null;
					time = time ? time.innerText.trim().toLowerCase() : null;
					authors = authors ? Array.from(authors).map((a) => a.innerText.trim()) : [];
					if (authors.length > 0) authors.pop();

					// //extract time
					// let timeNum = +time[0];
					// let timeLength = time[1];

					// if (timeLength == "hours") {
					// 	timestamp.setDate(timestamp.getHours() - timeNum);
					// } else if (timeLength == "mins") {
					// 	timestamp.setDate(timestamp.getMinutes() - timeNum);
					// }

					return { headline, subHeadline, authors, category, time };
				});

				const { headline, subHeadline, authors, category, time } = articleData;

				//extract time
				let timeNum = +time[0];
				let timeLength = time[1];
				if (timeLength == "hours") {
					timestamp.setDate(timestamp.getHours() - timeNum);
				} else if (timeLength == "mins") {
					timestamp.setDate(timestamp.getMinutes() - timeNum);
				}

				//create a new article object to store in database
				let NewFoxArticle = new Article({
					headline: headline,
					subHeadline: subHeadline,
					authors: authors,
					category: category,
					url: url,
					screenshotLight: lightScreenshotURL,
					screenshotDark: darkScreenshotURL,
					source: "fox",
					timestamp: timestamp.toISOString(),
				});
				try {
					let a = await NewFoxArticle.save();
					console.info("Succesfully archived article " + url);
					console.log(a);
				} catch (e) {
					throw new Error(e);
				}
			} catch (e) {
				console.log(e);
			}
		}
	} catch (err) {
		console.log(err);
	} finally {
		//close the browser at the end in order to not have zombie spawns
		await browser.close();
	}
};

module.exports = scrapeFox;

/*
let h2 = document.querySelector("main.main-content  div.content h2.title")
x.parentElement.parentElement.querySelectorAll("li a")
*/

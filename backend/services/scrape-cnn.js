// const puppeteer = process.env.NODE_ENV !== "production" ? require("puppeteer") : require("puppeteer-core");
// const moment = require("moment-timezone");
// const aws = require("aws-sdk"); //AWS SDK, to use the S3 bucket
// const Article = require("../models/article"); //article model

// //to configure the credentials for the S3 bucket
// aws.config.update({
// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 	secretAccessKey: process.env.AWS_SECRET_KEY,
// });
// //create s3 object in order to upload to an S3 bucket
// const s3 = new aws.S3();
// //bucket name and region
// const bucket = process.env.S3_BUCKET_NAME;
// const region = process.env.S3_BUCKET_REGION;

// //default bucket params. Only need to add `Body` and `Key` properties for each respective object
// const defaultBucketParams = {
// 	Bucket: bucket,
// 	Metadata: { "Content-Type": "image/jpeg" },
// 	ContentType: "image/jpeg",
// };

// //regex pattern to escape certain characters in a path
// const regexPattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

// //to autoscroll page in order to load lazy loading images
// async function autoScroll(page) {
// 	await page.evaluate(async () => {
// 		await new Promise((resolve, reject) => {
// 			var totalHeight = 0;
// 			var distance = 100;
// 			var timer = setInterval(() => {
// 				var scrollHeight = document.body.scrollHeight;
// 				window.scrollBy(0, distance);
// 				totalHeight += distance;

// 				if (totalHeight >= scrollHeight) {
// 					clearInterval(timer);
// 					resolve();
// 				}
// 			}, 100);
// 		});
// 	});
// }

// const scrapeCnn = async () => {
// 	// open browser
// 	const browser =
// 		process.env.NODE_ENV !== "production"
// 			? await puppeteer.launch({ headless: true })
// 			: await puppeteer.launch({
// 					executablePath: "/usr/bin/google-chrome-stable",
// 					headless: true,
// 					args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 			  });

// 	try {
// 		//open new page and go to URL
// 		let page = await browser.newPage();
// 		await page.goto("https://us.cnn.com/us", { waitUntil: "domcontentloaded", timeout: 0 });

// 		//autoscroll page to load lazy images
// 		await autoScroll(page);
// 		await page.evaluate(() => window.scroll(0, 0));

// 		//scrape the list of articles from latest news
// 		const data = await page.evaluate(() => {
// 			let h2 = document.querySelector('h2[data-analytics="The latest US stories_list-xs_"]');
// 			let lis = h2.parentElement.querySelectorAll("li");

// 			let returnedURLS = {};

// 			lis.forEach((li) => {
// 				let a = li.querySelector("a");
// 				let url = a ? a.href : null;
// 				if (url.includes("/videos/us") || url.includes("/us/gallery")) return; // ignore if it is a video or gallery article

// 				returnedURLS[url] = true;
// 			});

// 			return returnedURLS;
// 		});

// 		//iterate through each URL key in data
// 		for (url in data) {
// 			//insert everything in a try catch block in order to continue execution for other articles if they are valid
// 			try {
// 				//checking if article already exists in database. If yes, then ignore
// 				let doc;
// 				try {
// 					doc = await Article.findOne({ url: url });
// 					if (doc) throw new Error("CNN article " + url + " already exists in database. Skip");
// 					else console.info("Article " + url + " is a new article");
// 				} catch (e) {
// 					// console.log(e);
// 					throw new Error(e);
// 				}

// 				//now, to visit the article link
// 				await page.goto(url, {
// 					waitUntil: "domcontentloaded",
// 					timeout: 0,
// 				});

// 				//autoscroll page to load lazy images
// 				await autoScroll(page);
// 				await page.evaluate(() => window.scroll(0, 0));

// 				//take light mode screnshot
// 				let lightScreenshotBuffer = await page.screenshot({ fullPage: true });

// 				//insert CSS stylings to convert site into dark mode, and then take dark mode screenshot
// 				await page.addStyleTag({
// 					content: `* {
//                         color: #eeeeee !important;
//                         background-color: #222831 !important;
//                         border-color: #222831 !important;
//                     }`,
// 				});
// 				let darkScreenshotBuffer = await page.screenshot({ fullPage: true });

// 				//scrape the article's data
// 				const scrapedData = await page.evaluate(() => {
// 					//scrape headline, author and date
// 					let headline = document.querySelector("h1.pg-headline");
// 					let authorsRawString = document.querySelector("div.metadata p.metadata__byline span");
// 					let dateString = document.querySelector("div.metadata p.update-time").innerText;

// 					headline = headline ? headline.innerText : null;
// 					let authors = authorsRawString ? authorsRawString.innerText : null;
// 					authors = authors
// 						.slice(3, authors.length - 5)
// 						.replace(/,?\s*and\s*|,\s*/g, "_")
// 						.split("_");

// 					dateString = dateString
// 						.replace(/,\s*|\s+/g, "_")
// 						.split("_")
// 						.slice(1);

// 					let [time, ampm, zone, day, month, mday, year] = dateString;

// 					const formattedDateString = `${month} ${mday} ${year} ${time} ${ampm}`;

// 					return { headline, authors, formattedDateString };
// 				});

// 				//extract data returned from page.evaluate
// 				const { headline, authors, formattedDateString } = scrapedData;

// 				//get date in et format and convert it into UTC with datetime
// 				let date = moment.tz(formattedDateString, "LLL", "America/New_York").format();
// 				date = new Date(date);

// 				/*
//                 Upload file to S3 bucket
//                 steps:
//                 1. acquire default name after parsing URL.
//                 2. from the default name, prepend "light" and "dark" in order to create light mode and dark mode names for screenshot
//                    to store in bucket.
//                 3. Upload it lol
//                 */
// 				//step 1
// 				//normalize name by escaping the characters in the REGEX, in order to have a file name
// 				let name =
// 					url
// 						.slice("https://us.cnn.com/".length, url.length)
// 						.replace(regexPattern, " ")
// 						.toLowerCase()
// 						.split(" ")
// 						.join("-") + ".jpg"; //and adding the jpg extension

// 				//dark mode and light mode screenshot names
// 				let darkName = "dark-" + name;
// 				let lightName = "light-" + name;

// 				//setting the parameters for uploading to the bucket, and then uploading screenshot with putObject() using the params
// 				const bucketParamsLight = {
// 					...defaultBucketParams,
// 					Key: lightName,
// 					Body: lightScreenshotBuffer,
// 				};
// 				const bucketParamsDark = {
// 					...defaultBucketParams,
// 					Key: darkName,
// 					Body: darkScreenshotBuffer,
// 				};
// 				await s3.putObject(bucketParamsLight).promise();
// 				await s3.putObject(bucketParamsDark).promise();

// 				//acquire link of newly uploaded screenshot
// 				const lightScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${lightName}`;
// 				const darkScreenshotURL = `https://${bucket}.s3.${region}.amazonaws.com/${darkName}`;

// 				const article = new Article({
// 					headline: headline,
// 					authors: authors,
// 					url: url,
// 					screenshotDark: darkScreenshotURL,
// 					screenshotLight: lightScreenshotURL,
// 					source: "cnn",
// 					timestamp: new Date(date),
// 				});

// 				try {
// 					let a = await article.save();
// 					console.info("Successfully archived CNN article: " + url);
// 					console.log(a);
// 				} catch (e) {
// 					throw new Error(e);
// 				}
// 			} catch (e) {
// 				console.error(e);
// 			}
// 		}
// 	} catch (e) {
// 		console.error(e);
// 	} finally {
// 		await browser.close();
// 	}
// };

// module.exports = scrapeCnn;

const puppeteer = process.env.NODE_ENV !== "production" ? require("puppeteer") : require("puppeteer-core");
const moment = require("moment-timezone");
const aws = require("aws-sdk"); //AWS SDK, to use the S3 bucket

//models
const Article = require("../models/article"); //article model
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

//default bucket params. Only need to add `Body` and `Key` properties for each respective object
const defaultBucketParams = {
	Bucket: bucket,
	Metadata: { "Content-Type": "image/jpeg" },
	ContentType: "image/jpeg",
};

//regex pattern to escape certain characters in a path
const regexPattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

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

//to autoscroll page in order to load lazy loading images
async function autoScroll(page) {
	await page.evaluate(async () => {
		await new Promise((resolve, reject) => {
			var totalHeight = 0;
			var distance = 100;
			var timer = setInterval(() => {
				var scrollHeight = document.body.scrollHeight;
				window.scrollBy(0, distance);
				totalHeight += distance;

				if (totalHeight >= scrollHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 100);
		});
	});
}

const scrapeCnn = async () => {
	// open browser
	const browser =
		process.env.NODE_ENV !== "production"
			? await puppeteer.launch({ headless: true })
			: await puppeteer.launch({
					executablePath: "/usr/bin/google-chrome-stable",
					headless: true,
					args: ["--no-sandbox", "--disable-setuid-sandbox"],
			  });

	try {
		//open new page and go to URL
		let page = await browser.newPage();
		//set width to 800px and height to 1560px (perfect width and height for both fox and CNN)
		await page.setViewport({
			height: 1560,
			width: 800,
		});

		//go to the cnn url
		await page.goto("https://us.cnn.com", { waitUntil: "domcontentloaded", timeout: 0 });

		//autoscroll page to load lazy images
		await autoScroll(page);
		await page.evaluate(() => window.scroll(0, 0));

		//scrape the list of articles from latest news
		const data = await page.evaluate(() => {
			//scrape headline
			let headline = document.querySelector("h2");

			headline = headline ? headline.innerText.trim() : null;

			// scrape all the urls of articles
			let urls = new Set(
				[...document.querySelectorAll("section.zn-center-fluid a")].map((a) =>
					a.href.includes("/videos/") || a.href.includes("/gallery/") ? null : a.href
				)
			);
			urls.delete(null); //get rid of the null article(returned in map() when it is a video/gallery article)

			return { headline, urls: [...urls] };
		});

		//extract the headline and the urls set
		const { headline, urls } = data;
		console.log(urls);

		//first, to save the headline
		try {
			let headlinerExists = await Headliner.countDocuments({ source: "cnn", headline: headline });

			//if headline is already archivedm just skip, else, screenshot the page and add it to the database
			if (headline && headlinerExists > 0)
				throw new Error(`[CNN] => Headline "${headline}" already exists. Skipping...`);
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
					source: "cnn",
					timestamp: Date.now(),
				});

				await newHeadliner.save();
				console.log("[CNN] => Archived new headliner main page");
			}
		} catch (e) {
			console.log(e);
		}

		//iterate through each URL key in data
		for (let url of urls) {
			//insert everything in a try catch block in order to continue execution for other articles if they are valid
			try {
				//checking if article already exists in database. If yes, then ignore
				let doc;
				try {
					doc = await Article.findOne({ url: url });
					if (doc) throw new Error("CNN article " + url + " already exists in database. Skip");
					else console.log("Article " + url + " is a new article");
				} catch (e) {
					// console.log(e);
					throw new Error(e);
				}

				//now, to visit the article link
				await page.goto(url, {
					waitUntil: "domcontentloaded",
					timeout: 0,
				});

				//autoscroll page to load lazy images
				await autoScroll(page);
				await page.evaluate(() => window.scroll(0, 0));

				//take light mode screnshot
				let lightScreenshotBuffer = await page.screenshot({ fullPage: true });
				//convert page to dark mode
				convertPageToDarkMode(page);
				//take dark mode screenshot
				let darkScreenshotBuffer = await page.screenshot({ fullPage: true });

				//scrape the article's data
				const scrapedData = await page.evaluate(() => {
					//scrape headline, author and date
					let headline = document.querySelector("h1");
					let authorsRawString = document.querySelector("div.metadata p.metadata__byline span");
					let dateString = document.querySelector("div.metadata p.update-time").innerText;

					headline = headline ? headline.innerText.trim() : null;
					let authors = authorsRawString ? authorsRawString.innerText.trim() : null;
					authors = authors
						.slice(3, authors.length - 5)
						.replace(/,?\s*and\s*|,\s*/g, "_")
						.split("_");

					dateString = dateString
						.replace(/,\s*|\s+/g, "_")
						.split("_")
						.slice(1);

					let [time, ampm, zone, day, month, mday, year] = dateString;

					const formattedDateString = `${month} ${mday} ${year} ${time} ${ampm}`;

					return { headline, authors, formattedDateString };
				});

				//extract data returned from page.evaluate
				const { headline, authors, formattedDateString } = scrapedData;

				//get date in et format and convert it into UTC with datetime
				let date = moment.tz(formattedDateString, "LLL", "America/New_York").format();
				date = new Date(date);

				/*
                Upload file to S3 bucket
                steps:
                1. acquire default name after parsing URL.
                2. from the default name, prepend "light" and "dark" in order to create light mode and dark mode names for screenshot
                   to store in bucket.
                3. Upload it lol
                */
				//step 1
				//normalize name by escaping the characters in the REGEX, in order to have a file name
				let name =
					url
						.slice("https://us.cnn.com/".length, url.length)
						.replace(regexPattern, " ")
						.toLowerCase()
						.split(" ")
						.join("-") + ".jpg"; //and adding the jpg extension

				//dark mode and light mode screenshot names
				let darkName = "dark-" + name;
				let lightName = "light-" + name;

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

				const article = new Article({
					headline: headline,
					authors: authors,
					url: url,
					screenshotDark: darkScreenshotURL,
					screenshotLight: lightScreenshotURL,
					source: "cnn",
					timestamp: new Date(date),
				});

				try {
					let a = await article.save();
					console.info("Successfully archived CNN article: " + url);
					console.log(a);
				} catch (e) {
					throw new Error(e);
				}
			} catch (e) {
				console.error(e);
			}
		}
	} catch (e) {
		console.error(e);
	} finally {
		await browser.close();
	}
};

module.exports = scrapeCnn;

// formattedDateString, "LLL"

/*
let h2 = document.querySelector('h2[data-analytics="The latest US stories_list-xs_"]')
h2.parentElement.querySelectorAll("li");

document.querySelector("section.zn-center-fluid")
*/

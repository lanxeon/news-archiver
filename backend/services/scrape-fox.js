const puppeteer = process.env.NODE_ENV !== "production" ? require("puppeteer") : require("puppeteer-core");
const aws = require("aws-sdk"); //AWS SDK, to use the S3 bucket

//article model
const Article = require("../models/article");

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

const scrapeFox = async () => {
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
		//open a new page on the browser
		const page = await browser.newPage();

		//go to the fox news US URL
		await page.goto("https://www.foxnews.com/us", { waitUntil: "domcontentloaded", timeout: 0 });

		// //screenshot the main page: *not needed*
		// await page.screenshot({ path: "./static/latest-fox.jpg", fullPage: true });

		//page.evaluate lets us access the DOM elements of the page such as
		//accessing the "document" object and performing query selectors, etc, and the return value is stored in "data"
		const data = await page.evaluate(() => {
			//scrape the articles from each section
			let articles = [
				...document.querySelectorAll("main.main-content > section.collection > div > article"),
			];

			//visitedUrls object to ensure that we don't add duplicate article URLS
			visitedUrls = {};
			//final array to return to `data`
			let finalResult = [];

			//for each article object scraped, scrape category, time and URL (ignore for objects whose time is more than 15 mins)
			articles.forEach((article) => {
				let time, category;

				//for sections with `article-list` class, they contain an extra div before we can access the object with time and category
				if (article.parentElement.classList.contains("article-list")) {
					time = article.querySelector(".info > header > div.meta > div > span.time");

					category = article.querySelector(".info > header > div.meta > div > span.eyebrow > a");
				} else {
					//otherwise no extra div in between, just access direct children
					time = article.querySelector(".info > header > div.meta > span.time");
					category = article.querySelector(".info > header > div.meta > span.eyebrow > a");
				}

				//if there is no time provided, we ignore the article
				if (!time) return;

				//sanitise the string by converting them into lowercase and getting rid of leading and trailing whitespaces
				time = time.innerHTML.trim().toLowerCase();
				category = category ? category.innerHTML.trim().toLowerCase() : null;

				//time is in the form "1 hour ago", "32 mins ago", "5 days ago", etc. So essentially in the form of 3 words that we can split.
				//in the form of <time, mins/hours/days, ago>. So we need to specifically extract the first 2 parameters
				time = time.split(" ");
				//if time is not in mins (since we want new articles published every 15 minutes), or if category is "video", we ignore the article
				if (time[1] !== "mins" || category === "video") return;
				let minutes = parseInt(time[0]); // get minutes by parsing to integer

				//only continue for articles that were published 15 minutes ago or earlier
				if (minutes <= 15) {
					//scrape the div with class m to get the href attribute of the <a> in order to get the *relative* URL
					let link = article.querySelector(".m > a").getAttribute("href");

					console.info("Fox article " + link + " is a new article");

					//if we have already come across an article in a section with the URL(sometimes an article is repeated in another section),
					//we skip the object
					if (visitedUrls[link]) return;
					//else add the link to the hashmap(or as simpletons would call it, a js object)
					visitedUrls[link] = true;

					//if the domain link is not provided, prepend it to the relative URL
					if (!link.includes("https://foxnews.com")) link = "https://foxnews.com" + link;

					//create a new Date object with the current time and subtract the `minutes` in order to get
					//the exact time of the publishing of the article
					let date = new Date();
					date.setMinutes(date.getMinutes() - minutes);

					// //convert to UTC time
					// const offsetUTC = date.getTimezoneOffset();
					// date.setMinutes(date.getMinutes() + offsetUTC);

					//add the URL, the timestamp and category to the final returned array
					finalResult.push({
						url: link,
						timestamp: JSON.stringify(date),
						category,
					});
				}
			});

			//return the array of URLS(and their timestamp and category) to visit
			return finalResult;
		});

		//regex pattern to escape certain characters in a path
		let regexPattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

		//iterate through the array of articles and their URL(and category+timestamp) returned in `data`
		for (d of data) {
			try {
				//extract the URL, timestamp and category
				let url = d.url;
				let timestamp = JSON.parse(d.timestamp);
				// let timestamp = JSON.parse(d.timestamp);
				let category = d.category;

				//normalize name by escaping the characters in the REGEX, in order to have a file name
				let name =
					url
						.slice("https://foxnews.com/us/".length, url.length)
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

				//convert page to dark mode by adding our own custom CSS
				await page.addStyleTag({
					content: `* {
				color: #eeeeee !important;
				background-color: #222831 !important;
				border-color: #222831 !important;
			 }`,
				});

				//take dark mode screenshot
				let darkScreenshotBuffer = await page.screenshot({ fullPage: true });

				//setting the parameters for uploading to the bucket, and then uploading screenshot with putObject() using the params
				const bucketParamsLight = {
					Bucket: bucket,
					Key: lightName,
					Body: lightScreenshotBuffer,
					Metadata: { "Content-Type": "image/jpeg" },
					ContentType: "image/jpeg",
				};
				const bucketParamsDark = {
					Bucket: bucket,
					Key: darkName,
					Body: darkScreenshotBuffer,
					Metadata: { "Content-Type": "image/jpeg" },
					ContentType: "image/jpeg",
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
					let author = document.querySelector("div.author-byline > span > span > a");

					//sometimes, one or more of the fields are null, so need to ensure that we only access innerHTML if the DOM element exists
					headline = headline ? headline.innerHTML.trim() : null;
					subHeadline = subHeadline ? subHeadline.innerHTML.trim() : null;
					author = author ? author.innerHTML.trim() : null;

					return { headline, subHeadline, author };
				});

				const { headline, subHeadline, author } = articleData;

				//create a new article object to store in database
				let NewFoxArticle = new Article({
					headline: headline,
					subHeadline: subHeadline,
					authors: [author],
					category: category,
					url: url,
					screenshotLight: lightScreenshotURL,
					screenshotDark: darkScreenshotURL,
					source: "fox",
					timestamp: timestamp,
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

const puppeteer = require("puppeteer");
const moment = require("moment-timezone");
const aws = require("aws-sdk"); //AWS SDK, to use the S3 bucket
const Article = require("../models/article"); //article model

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

//default bucket params. Only need to add body and key.
const defaultBucketParams = {
	Bucket: bucket,
	Metadata: { "Content-Type": "image/jpeg" },
	ContentType: "image/jpeg",
	// Key: lightName,
	// Body: lightScreenshotBuffer,
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
	//launch browser
	const browser = await puppeteer.launch({
		headless: true,
	});

	try {
		//open new page and go to URL
		let page = await browser.newPage();
		await page.goto("https://us.cnn.com/us", { waitUntil: "domcontentloaded", timeout: 0 });

		//autoscroll page to load lazy images
		await autoScroll(page);
		await page.evaluate(() => window.scroll(0, 0));

		//scrape the list of articles from latest news
		const data = await page.evaluate(() => {
			let h2 = document.querySelector('h2[data-analytics="The latest US stories_list-xs_"]');
			let lis = h2.parentElement.querySelectorAll("li");

			let returnedURLS = {};

			lis.forEach((li) => {
				let a = li.querySelector("a");
				let url = a ? a.href : null;
				if (url.includes("/videos/us") || url.includes("/us/gallery")) return; // ignore if it is a video or gallery article

				returnedURLS[url] = true;
			});

			return returnedURLS;
		});

		//iterate through each URL key in data
		for (url in data) {
			//insert everything in a try catch block in order to continue execution for other articles if they are valid
			try {
				//checking if article already exists in database. If yesm then ignore
				let doc;
				try {
					doc = await Article.findOne({ url: url });
					if (doc) throw new Error("article already exists in database. Skip");
					console.log("new document. YAY");
				} catch (e) {
					console.log("DB ERROR");
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

				//insert CSS stylings to convert site into dark mode, and then take dark mode screenshot
				await page.addStyleTag({
					content: `* {
                        color: #eeeeee !important;
                        background-color: #222831 !important;
                        border-color: #222831 !important;
                    }`,
				});
				let darkScreenshotBuffer = await page.screenshot({ fullPage: true });

				const scrapedData = await page.evaluate(() => {
					//scrape headline, author and date
					let headline = document.querySelector("h1.pg-headline");
					let authorsRawString = document.querySelector("div.metadata p.metadata__byline span");
					let dateString = document.querySelector("div.metadata p.update-time").innerText;

					headline = headline ? headline.innerText : null;
					let authors = authorsRawString ? authorsRawString.innerText : null;
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

				//get date in et format and convert it into UTC with datetime
				let date = moment.tz(scrapedData.formattedDateString, "LLL", "America/New_York").format();
				let newDate = new Date(date);
			} catch (e) {
				console.log(e);
			}
		}
	} catch (e) {
		console.log(e);
	} finally {
		console.log("closing browser");
		await browser.close();
		console.log("closing mongoose connection");
		mongoose.connection.close();
	}
};

module.exports = scrapeCnn;

// formattedDateString, "LLL"

/*
let h2 = document.querySelector('h2[data-analytics="The latest US stories_list-xs_"]')
h2.parentElement.querySelectorAll("li");
*/

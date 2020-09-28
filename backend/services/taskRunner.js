const CronJob = require("cron").CronJob;

//fox news scraper
const scrapeFoxNews = require("./scrape-fox");

console.log("Initializing cron constructor");

const job = new CronJob(
	"0 */15 * * * *", // time in seconds minutes hours days months day(of the week)
	() => {
		console.log("running cron job as scheduled => " + new Date().toUTCString());
		scrapeFoxNews();
	},
	null, // onComplete function - will run when job is stopped(not when job function completes)
	true, // start - whether to start the job moment constructor initialization done
	"America/Los_Angeles", // timeZone
	undefined, // to skip the "context" parameter and keep it as default
	false // runOnInit - to run immediately instead of first waiting for 15 minutes (UPDATE: Not needed)
);
//to start the job(not necessary here because we kept the "start" parameter as true)
job.start();

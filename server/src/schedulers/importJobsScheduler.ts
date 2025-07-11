// Create jobs every hour
import { importAllFeeds } from "../services/importJobs";
import cron from "node-cron";

cron.schedule("0 0 * * * *", async () => {
  await importAllFeeds();
  console.log("Import jobs executed");
});

import { jobQueue } from "../queues/jobQueue";
import ImportLog from "../models/ImportLog";
import { fetchJobsFromFeed } from "./fetchJobs";

const FEEDS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

export async function importAllFeeds(): Promise<void> {
  await Promise.allSettled(
    FEEDS.map(async (feedUrl) => {
      try {
        const jobs = await fetchJobsFromFeed(feedUrl);
        const failed: { reason: string; raw: any }[] = [];

        await Promise.all(
          jobs.map(async (job) => {
            try {
              await jobQueue.add("job", job);
            } catch (err: any) {
              failed.push({ reason: err.message, raw: job });
            }
          })
        );

        await ImportLog.create({
          feedUrl,
          totalFetched: jobs.length,
          totalImported: jobs.length - failed.length,
          newJobs: 0, // Optional: Enhance via job logic
          updatedJobs: 0,
          failedJobs: failed,
        });
      } catch (err: any) {
        // Log the error and optionally create a failed ImportLog entry
        console.error(`Failed to process feed ${feedUrl}:`, err);
        await ImportLog.create({
          feedUrl,
          totalFetched: 0,
          totalImported: 0,
          newJobs: 0,
          updatedJobs: 0,
          failedJobs: [{ reason: err.message || String(err), raw: null }],
        });
      }
    })
  );
}

import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Job from "../models/Job";

export const worker = new Worker(
  "jobs",
  async (job) => {
    const jobData = job.data;
    console.log(`Processing job ${job.id} with link: ${jobData.link}`);
    await Job.updateOne({ link: jobData.link }, jobData, { upsert: true });
    return { processed: true };
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully.`, "completed");
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message, job?.data, "failed");
});

export default worker;

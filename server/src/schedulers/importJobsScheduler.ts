// Create jobs every day at 3:15 (am)
import { jobQueue } from "../queues/jobQueue";

const importJobsScheduler = async () =>
  await jobQueue.upsertJobScheduler(
    "my-job-scheduler-1",
    { pattern: "0 0 * * * *" },
    {
      name: "my-job-name",
      opts: {
        backoff: 3,
        attempts: 5,
        removeOnFail: 1000,
      },
    }
  );

importJobsScheduler();

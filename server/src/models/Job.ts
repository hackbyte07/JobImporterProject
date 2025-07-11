import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  id: string;
  link: string;
  pubDate: string;
  guid: {
    _: string;
    $: {
      isPermaLink: string; // 'true' or 'false' as string
    };
  };
  description: string;
  "content:encoded": string;
  "media:content": {
    $: {
      url: string;
      medium: string; // typically "image"
    };
  };
  "job_listing:location": string;
  "job_listing:job_type": string;
  "job_listing:company": string;
}

const JobSchema = new Schema<IJob>(
  {
    title: String,
    id: String,
    link: String,
    pubDate: String,
    guid: {
      _: String,
      $: {
        isPermaLink: String,
      },
    },
    description: String,
    "content:encoded": String,
    "media:content": {
      $: {
        url: String,
        medium: String,
      },
    },
    "job_listing:location": String,
    "job_listing:job_type": String,
    "job_listing:company": String,
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);

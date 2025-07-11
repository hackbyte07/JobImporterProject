import mongoose, { Document, Schema } from "mongoose";

interface FailedJob {
  reason: string;
  raw: any;
}

export interface IImportLog extends Document {
  timestamp: Date;
  feedUrl: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJob[];
}

const ImportLogSchema = new Schema<IImportLog>({
  timestamp: { type: Date, default: Date.now },
  feedUrl: String,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ reason: String, raw: Schema.Types.Mixed }],
});

export default mongoose.model<IImportLog>("ImportLog", ImportLogSchema);

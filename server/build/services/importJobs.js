"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAllFeeds = importAllFeeds;
const jobQueue_1 = require("../queues/jobQueue");
const ImportLog_1 = __importDefault(require("../models/ImportLog"));
const fetchJobs_1 = require("./fetchJobs");
const FEEDS = [
    'https://jobicy.com/?feed=job_feed',
    'https://www.higheredjobs.com/rss/articleFeed.cfm'
];
function importAllFeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const feedUrl of FEEDS) {
            const jobs = yield (0, fetchJobs_1.fetchJobsFromFeed)(feedUrl);
            let failed = [];
            for (const job of jobs) {
                try {
                    yield jobQueue_1.jobQueue.add('job', job);
                }
                catch (err) {
                    failed.push({ reason: err.message, raw: job });
                }
            }
            yield ImportLog_1.default.create({
                feedUrl,
                totalFetched: jobs.length,
                totalImported: jobs.length - failed.length,
                newJobs: 0, // Optional: Enhance via job logic
                updatedJobs: 0,
                failedJobs: failed
            });
        }
    });
}

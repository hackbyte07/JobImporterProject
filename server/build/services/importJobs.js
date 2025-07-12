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
function importAllFeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.allSettled(FEEDS.map((feedUrl) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield (0, fetchJobs_1.fetchJobsFromFeed)(feedUrl);
                const failed = [];
                yield Promise.all(jobs.map((job) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield jobQueue_1.jobQueue.add("job", job);
                    }
                    catch (err) {
                        failed.push({ reason: err.message, raw: job });
                    }
                })));
                yield ImportLog_1.default.create({
                    feedUrl,
                    totalFetched: jobs.length,
                    totalImported: jobs.length - failed.length,
                    newJobs: 0, // Optional: Enhance via job logic
                    updatedJobs: 0,
                    failedJobs: failed,
                });
            }
            catch (err) {
                // Log the error and optionally create a failed ImportLog entry
                console.error(`Failed to process feed ${feedUrl}:`, err);
                yield ImportLog_1.default.create({
                    feedUrl,
                    totalFetched: 0,
                    totalImported: 0,
                    newJobs: 0,
                    updatedJobs: 0,
                    failedJobs: [{ reason: err.message || String(err), raw: null }],
                });
            }
        })));
    });
}

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
exports.worker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const Job_1 = __importDefault(require("../models/Job"));
exports.worker = new bullmq_1.Worker("jobs", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const jobData = job.data;
    const existing = yield Job_1.default.findOne({ url: jobData.url });
    if (existing) {
        yield Job_1.default.updateOne({ url: jobData.url }, jobData);
        return { updated: true };
    }
    else {
        yield Job_1.default.create(jobData);
        return { created: true };
    }
}), {
    connection: redis_1.redisConnection,
});
exports.worker.on("failed", (job, err) => {
    console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err.message);
});

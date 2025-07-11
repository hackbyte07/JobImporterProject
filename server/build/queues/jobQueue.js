"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.jobQueue = new bullmq_1.Queue("jobs", {
    connection: redis_1.redisConnection,
});

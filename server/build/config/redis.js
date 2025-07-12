"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./env");
dotenv_1.default.config();
exports.redisConnection = new ioredis_1.Redis({
    host: env_1.env.REDIS_URL,
    username: "default",
    password: "mnv4N4PlSCODBciT401MnxcXM72k2Lcy",
    port: 10135,
    maxRetriesPerRequest: null,
});

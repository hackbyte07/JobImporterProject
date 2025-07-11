import { Redis } from "ioredis";
import dotenv from "dotenv";
import { env } from "./env";
dotenv.config();

export const redisConnection = new Redis({
  host: env.REDIS_URL,
  username: "default",
  password: "mnv4N4PlSCODBciT401MnxcXM72k2Lcy",
  port: 10135,
  maxRetriesPerRequest: null,
});

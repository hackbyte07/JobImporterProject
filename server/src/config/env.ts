import dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
  PORT: number;
  HOST: string;
  MONGO_URI: string;
  REDIS_URL: string;
};

export const env: EnvConfig = {
  HOST: process.env.HOST || "",
  PORT: Number(process.env.PORT) || 0,
  MONGO_URI: process.env.MONGO_URI || "",
  REDIS_URL: process.env.REDIS_URL || "",
};

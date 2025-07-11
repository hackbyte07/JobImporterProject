"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    HOST: process.env.HOST || "",
    PORT: Number(process.env.PORT) || 0,
    MONGO_URI: process.env.MONGO_URI || "",
    REDIS_URL: process.env.REDIS_URL || "",
};

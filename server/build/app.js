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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const importJobs_1 = require("./services/importJobs");
require("./jobs/worker"); //
const env_1 = require("./config/env");
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
app.get("/import", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, importJobs_1.importAllFeeds)();
    res.send("Job import started");
}));
app.listen(env_1.env.PORT, env_1.env.HOST, () => {
    console.log(`Server running on port ${env_1.env.PORT}`);
});

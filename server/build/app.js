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
require("./jobs/worker");
require("./schedulers/importJobsScheduler");
const env_1 = require("./config/env");
const importRoute_1 = __importDefault(require("./routes/importRoute"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(importRoute_1.default);
const runServer = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default
        .connect(env_1.env.MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB error:", err));
    app.listen(env_1.env.PORT, env_1.env.HOST, () => {
        console.log(`Server running on port ${env_1.env.PORT}`);
    });
});
//starting server
runServer();

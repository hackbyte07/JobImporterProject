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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importLogsStreamController = exports.importController = void 0;
const importJobs_1 = require("../services/importJobs");
const ImportLog_1 = __importDefault(require("../models/ImportLog"));
const importController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, importJobs_1.importAllFeeds)();
    res.send("Job import started");
});
exports.importController = importController;
const importLogsStreamController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const cursor = ImportLog_1.default.find().sort({ timestamp: -1 }).cursor();
        let buffer = [];
        try {
            for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                _c = cursor_1_1.value;
                _d = false;
                const chunk = _c;
                buffer.push(chunk);
                if (buffer.length === 50) {
                    res.write(`data: ${JSON.stringify(buffer)}\n\n`);
                    buffer = [];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // After the cursor is done, send any remaining logs in the buffer (less than 50)
        if (buffer.length > 0) {
            res.write(`data: ${JSON.stringify(buffer)}\n\n`);
        }
        // Optionally, stream new logs in real-time using MongoDB change streams
        const changeStream = ImportLog_1.default.watch([], { fullDocument: "updateLookup" });
        changeStream.on("change", () => __awaiter(void 0, void 0, void 0, function* () {
            // When a new log is inserted, fetch the latest 50 logs and send as an array
            const newLogs = yield ImportLog_1.default.find().sort({ timestamp: -1 });
            res.write(`data: ${JSON.stringify(newLogs)}\n\n`);
        }));
        // Clean up on client disconnect
        req.on("close", () => {
            changeStream.close();
            res.end();
        });
    }
    catch (error) {
        res.status(500);
        console.error(error);
    }
});
exports.importLogsStreamController = importLogsStreamController;

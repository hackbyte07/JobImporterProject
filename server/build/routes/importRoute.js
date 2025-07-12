"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const importController_1 = require("../controller/importController");
const importRouter = (0, express_1.Router)();
importRouter.get("/import", importController_1.importController);
importRouter.get("/import/logs/stream", importController_1.importLogsStreamController);
exports.default = importRouter;

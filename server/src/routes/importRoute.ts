import { Router } from "express";
import {
  importController,
  importLogsStreamController,
} from "../controller/importController";

const importRouter = Router();

importRouter.get("/import", importController);

importRouter.get("/import/logs/stream", importLogsStreamController);

export default importRouter;

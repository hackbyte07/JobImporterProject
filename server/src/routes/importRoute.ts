import { Router } from "express";
import { importController } from "../controller/importController";

const importRouter = Router();

importRouter.get("/import", importController);

export default importRouter;

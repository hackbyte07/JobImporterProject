import { Request, Response } from "express";
import { importAllFeeds } from "../services/importJobs";

const importController = async (req: Request, res: Response) => {
  await importAllFeeds();
  res.send("Job import started");
};

export { importController };

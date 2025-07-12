import { Request, Response } from "express";
import { importAllFeeds } from "../services/importJobs";
import ImportLog, { IImportLog } from "../models/ImportLog";

const importController = async (req: Request, res: Response) => {
  await importAllFeeds();
  res.send("Job import started");
};

const importLogsStreamController = async (req: Request, res: Response) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const cursor = ImportLog.find().sort({ timestamp: -1 }).cursor();
    let buffer: IImportLog[] = [];

    for await (const chunk of cursor) {
      buffer.push(chunk);
      if (buffer.length === 50) {
        res.write(`data: ${JSON.stringify(buffer)}\n\n`);
        buffer = [];
      }
    }
    // After the cursor is done, send any remaining logs in the buffer (less than 50)
    if (buffer.length > 0) {
      res.write(`data: ${JSON.stringify(buffer)}\n\n`);
    }

    // Optionally, stream new logs in real-time using MongoDB change streams
    const changeStream = ImportLog.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async () => {
      // When a new log is inserted, fetch the latest 50 logs and send as an array
      const newLogs = await ImportLog.find().sort({ timestamp: -1 });
      res.write(`data: ${JSON.stringify(newLogs)}\n\n`);
    });

    // Clean up on client disconnect
    req.on("close", () => {
      changeStream.close();
      res.end();
    });
  } catch (error) {
    res.status(500);
    console.error(error);
  }
};

export { importController, importLogsStreamController };

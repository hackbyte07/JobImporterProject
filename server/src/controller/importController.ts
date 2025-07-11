import { Request, Response } from "express";
import { importAllFeeds } from "../services/importJobs";
import ImportLog from '../models/ImportLog';

const importController = async (req: Request, res: Response) => {
  await importAllFeeds();
  res.send("Job import started");
};


const importLogsStreamController = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send the latest 50 logs initially
  const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(50);
  res.write(`data: ${JSON.stringify(logs)}\n\n`);

  // Optionally, stream new logs in real-time using MongoDB change streams
  const changeStream = ImportLog.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', async () => {
    const newLogs = await ImportLog.find().sort({ timestamp: -1 }).limit(50);
    res.write(`data: ${JSON.stringify(newLogs)}\n\n`);
  });

  // Clean up on client disconnect
  req.on('close', () => {
    changeStream.close();
    res.end();
  });
};

export { importController, importLogsStreamController };

import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./jobs/worker"; //
import { env } from "./config/env";
import importRouter from "./routes/importRoute";

dotenv.config();
const app = Express();

app.use(Express.json());

app.use(importRouter);

const runServer = async () => {
  mongoose
    .connect(env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));

  app.listen(env.PORT, env.HOST, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

//starting server
runServer();

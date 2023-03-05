import express from "express";
import genCode from "../api/generate";
import queryState from "../api/state-query";
const app = express();
import { SPORT } from "../vite.config";
const SERVE_PORT = SPORT || process.env.SPORT;

app.get("/api/generate", async (req, res) => {
  await genCode(req as any, res as any);
});

app.get("/api/state-query", async (req, res) => {
  await queryState(req as any, res as any);
});

app
  .listen(SERVE_PORT, () => {
    console.log(`api serve listen on http://localhost:${SERVE_PORT}`);
  })
  .on("error", (error) => {
    console.log(error);
  });

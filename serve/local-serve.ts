import express from "express";
import genCode from "../api/generate";
import queryState from "../api/state-query";
const app = express();

app.get("/api/generate", async (req, res) => {
  await genCode(req as any, res as any);
});

app.get("/api/state-query", async (req, res) => {
  await queryState(req as any, res as any);
});

export { app };

import express from "express";
import genCode from "../api/generate";
import queryState from "../api/state-query";
import sign from "../api/sign";
import check_link from "../api/check_link";

const app = express();

app.get("/api/generate", async (req, res) => {
  await genCode(req as any, res as any);
});

app.get("/api/state-query", async (req, res) => {
  await queryState(req as any, res as any);
});

app.get("/api/sign", async (req, res) => {
  await sign(req as any, res as any);
});

app.get("/api/check_link", async (req, res) => {
  await check_link(req as any, res as any);
});

export { app };

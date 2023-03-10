import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { app } from "./local-serve";
const SERVE_PORT = process.env.SPORT;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  app.use(vite.middlewares);

  app.use("*", async (_, res) => {
    let indexhtml = fs.readFileSync(
      path.resolve(__dirname, "..", "index.html"),
      "utf-8"
    );
    res.status(200).set({ "Content-Type": "text/html" }).end(indexhtml);
  });
  app.listen(SERVE_PORT, () => {
    console.log(`server listen on http://localhost:${SERVE_PORT}`);
  });
}
createServer();

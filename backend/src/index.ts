import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { initDatabase } from "./db/schema";
import { createModulesRouter } from "./routes/modules";
import { createProjectsRouter } from "./routes/projects";
import { createTemplatesRouter } from "./routes/templates";

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = initDatabase();
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === "production";
const frontendDist = path.join(__dirname, "../../frontend/dist");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.use("/api/modules", createModulesRouter(db));
app.use("/api/templates", createTemplatesRouter());
app.use("/api/projects", createProjectsRouter(db));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (isProd && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(
    isProd
      ? `Aplikacja działa na porcie ${PORT} (frontend + API)`
      : `Serwer API działa na http://localhost:${PORT}`,
  );
});

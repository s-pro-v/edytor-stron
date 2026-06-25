import { Router } from "express";
import Database from "better-sqlite3";

export function createModulesRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    const modules = db
      .prepare("SELECT * FROM modules ORDER BY name")
      .all()
      .map((row: Record<string, unknown>) => ({
        ...row,
        default_config: JSON.parse(row.default_config as string),
      }));
    res.json(modules);
  });

  router.get("/:type", (req, res) => {
    const row = db
      .prepare("SELECT * FROM modules WHERE type = ?")
      .get(req.params.type) as Record<string, unknown> | undefined;

    if (!row) {
      res.status(404).json({ error: "Moduł nie znaleziony" });
      return;
    }

    res.json({
      ...row,
      default_config: JSON.parse(row.default_config as string),
    });
  });

  return router;
}

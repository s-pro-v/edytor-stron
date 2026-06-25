import { Router } from "express";
import Database from "better-sqlite3";
import { mapRows, parseJsonField, type DbRow } from "../db/helpers";

export function createModulesRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    const modules = mapRows(
      db.prepare("SELECT * FROM modules ORDER BY name").all(),
      (row) => ({
        ...row,
        default_config: parseJsonField(row.default_config),
      }),
    );
    res.json(modules);
  });

  router.get("/:type", (req, res) => {
    const row = db
      .prepare("SELECT * FROM modules WHERE type = ?")
      .get(req.params.type) as DbRow | undefined;

    if (!row) {
      res.status(404).json({ error: "Moduł nie znaleziony" });
      return;
    }

    res.json({
      ...row,
      default_config: parseJsonField(row.default_config),
    });
  });

  return router;
}

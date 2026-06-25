import { Router } from "express";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { mapRows, parseJsonField, type DbRow } from "../db/helpers";
import { PROJECT_TEMPLATES } from "../db/templates";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "strona"
  );
}

function applyTemplateModules(
  db: Database.Database,
  pageId: string,
  templateId: string,
) {
  const template = PROJECT_TEMPLATES.find((t) => t.id === templateId);
  if (!template || template.modules.length === 0) return;

  const getModule = db.prepare(
    "SELECT type, default_config FROM modules WHERE type = ?",
  );
  const insert = db.prepare(`
    INSERT INTO page_modules (id, page_id, module_type, config, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  template.modules.forEach((tm, index) => {
    const mod = getModule.get(tm.module_type) as
      | { type: string; default_config: string }
      | undefined;
    if (!mod) return;
    insert.run(uuidv4(), pageId, mod.type, mod.default_config, index);
  });
}

export function createProjectsRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    const projects = db
      .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
      .all();
    res.json(projects);
  });

  router.post("/", (req, res) => {
    const { name, description = "", template = "blank" } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: "Nazwa projektu jest wymagana" });
      return;
    }

    const projectId = uuidv4();
    const pageId = uuidv4();

    const create = db.transaction(() => {
      db.prepare(
        "INSERT INTO projects (id, name, description) VALUES (?, ?, ?)",
      ).run(projectId, name.trim(), description);

      db.prepare(
        "INSERT INTO pages (id, project_id, name, slug) VALUES (?, ?, ?, ?)",
      ).run(pageId, projectId, "Strona główna", "index");

      applyTemplateModules(db, pageId, template);
    });

    create();

    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId);
    res.status(201).json(project);
  });

  router.get("/:id", (req, res) => {
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(req.params.id);

    if (!project) {
      res.status(404).json({ error: "Projekt nie znaleziony" });
      return;
    }

    const getModules = db.prepare(`
      SELECT pm.*, m.name as module_name, m.icon as module_icon
      FROM page_modules pm
      LEFT JOIN modules m ON m.type = pm.module_type
      WHERE pm.page_id = ?
      ORDER BY pm.sort_order
    `);

    const pagesWithModules = mapRows(
      db
        .prepare("SELECT * FROM pages WHERE project_id = ? ORDER BY sort_order")
        .all(req.params.id),
      (page) => ({
        ...page,
        modules: mapRows(getModules.all(String(page.id)), (pm) => ({
          ...pm,
          config: parseJsonField(pm.config),
        })),
      }),
    );

    res.json({ ...project, pages: pagesWithModules });
  });

  router.put("/:id", (req, res) => {
    const { name, description } = req.body;
    const existing = db
      .prepare("SELECT id FROM projects WHERE id = ?")
      .get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: "Projekt nie znaleziony" });
      return;
    }

    db.prepare(
      `
      UPDATE projects SET name = ?, description = ?, updated_at = datetime('now')
      WHERE id = ?
    `,
    ).run(name, description ?? "", req.params.id);

    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(req.params.id);
    res.json(project);
  });

  router.delete("/:id", (req, res) => {
    const result = db
      .prepare("DELETE FROM projects WHERE id = ?")
      .run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Projekt nie znaleziony" });
      return;
    }
    res.status(204).send();
  });

  router.post("/:projectId/pages", (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: "Nazwa strony jest wymagana" });
      return;
    }

    const project = db
      .prepare("SELECT id FROM projects WHERE id = ?")
      .get(req.params.projectId);
    if (!project) {
      res.status(404).json({ error: "Projekt nie znaleziony" });
      return;
    }

    const maxOrder = db
      .prepare(
        "SELECT COALESCE(MAX(sort_order), -1) as m FROM pages WHERE project_id = ?",
      )
      .get(req.params.projectId) as { m: number };

    const pageId = uuidv4();
    const slug = slugify(name.trim());

    db.prepare(
      "INSERT INTO pages (id, project_id, name, slug, sort_order) VALUES (?, ?, ?, ?, ?)",
    ).run(pageId, req.params.projectId, name.trim(), slug, maxOrder.m + 1);

    db.prepare(
      "UPDATE projects SET updated_at = datetime('now') WHERE id = ?",
    ).run(req.params.projectId);

    const page = db
      .prepare("SELECT * FROM pages WHERE id = ?")
      .get(pageId) as DbRow;
    res.status(201).json({ ...page, modules: [] });
  });

  router.put("/:projectId/pages/:pageId", (req, res) => {
    const { name, slug } = req.body;
    const page = db
      .prepare("SELECT * FROM pages WHERE id = ? AND project_id = ?")
      .get(req.params.pageId, req.params.projectId) as DbRow | undefined;

    if (!page) {
      res.status(404).json({ error: "Strona nie znaleziona" });
      return;
    }

    const pageName = String(name ?? page.name);
    db.prepare("UPDATE pages SET name = ?, slug = ? WHERE id = ?").run(
      pageName,
      slug ?? slugify(pageName),
      req.params.pageId,
    );

    const updated = db
      .prepare("SELECT * FROM pages WHERE id = ?")
      .get(req.params.pageId);
    res.json(updated);
  });

  router.delete("/:projectId/pages/:pageId", (req, res) => {
    const pageCount = db
      .prepare("SELECT COUNT(*) as c FROM pages WHERE project_id = ?")
      .get(req.params.projectId) as { c: number };

    if (pageCount.c <= 1) {
      res.status(400).json({ error: "Nie można usunąć ostatniej strony" });
      return;
    }

    const result = db
      .prepare("DELETE FROM pages WHERE id = ? AND project_id = ?")
      .run(req.params.pageId, req.params.projectId);

    if (result.changes === 0) {
      res.status(404).json({ error: "Strona nie znaleziona" });
      return;
    }

    res.status(204).send();
  });

  router.put("/:projectId/pages/:pageId/modules", (req, res) => {
    const { modules } = req.body as {
      modules: Array<{
        id?: string;
        module_type: string;
        config: Record<string, unknown>;
        sort_order: number;
      }>;
    };

    const page = db
      .prepare("SELECT id FROM pages WHERE id = ? AND project_id = ?")
      .get(req.params.pageId, req.params.projectId);

    if (!page) {
      res.status(404).json({ error: "Strona nie znaleziona" });
      return;
    }

    const save = db.transaction(() => {
      db.prepare("DELETE FROM page_modules WHERE page_id = ?").run(
        req.params.pageId,
      );

      const insert = db.prepare(`
        INSERT INTO page_modules (id, page_id, module_type, config, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const mod of modules) {
        insert.run(
          mod.id || uuidv4(),
          req.params.pageId,
          mod.module_type,
          JSON.stringify(mod.config),
          mod.sort_order,
        );
      }

      db.prepare(
        "UPDATE projects SET updated_at = datetime('now') WHERE id = ?",
      ).run(req.params.projectId);
    });

    save();

    const saved = mapRows(
      db
        .prepare(
          "SELECT pm.*, m.name as module_name, m.icon as module_icon FROM page_modules pm LEFT JOIN modules m ON m.type = pm.module_type WHERE pm.page_id = ? ORDER BY pm.sort_order",
        )
        .all(req.params.pageId),
      (pm) => ({
        ...pm,
        config: parseJsonField(pm.config),
      }),
    );

    res.json(saved);
  });

  router.get("/:projectId/build", (req, res) => {
    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(req.params.projectId) as DbRow | undefined;

    if (!project) {
      res.status(404).json({ error: "Projekt nie znaleziony" });
      return;
    }

    const getModules = db.prepare(`
      SELECT * FROM page_modules WHERE page_id = ? ORDER BY sort_order
    `);

    const build = {
      project: { name: project.name, description: project.description },
      pages: mapRows(
        db
          .prepare(
            "SELECT * FROM pages WHERE project_id = ? ORDER BY sort_order",
          )
          .all(req.params.projectId),
        (page) => ({
          name: page.name,
          slug: page.slug,
          modules: mapRows(getModules.all(String(page.id)), (pm) => ({
            type: pm.module_type,
            config: parseJsonField(pm.config),
          })),
        }),
      ),
      generatedAt: new Date().toISOString(),
    };

    res.json(build);
  });

  return router;
}

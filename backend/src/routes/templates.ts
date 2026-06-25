import { Router } from "express";
import { PROJECT_TEMPLATES } from "../db/templates";

export function createTemplatesRouter(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(PROJECT_TEMPLATES);
  });

  return router;
}

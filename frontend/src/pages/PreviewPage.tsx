import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { CustomSelect } from "../components/CustomSelect";
import { api } from "../api/client";
import type { Project } from "../types";
import { ModuleRenderer } from "../modules/ModuleRenderer";

export function PreviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [activePageId, setActivePageId] = useState("");

  useEffect(() => {
    if (!projectId) return;
    api.projects.get(projectId).then((proj) => {
      setProject(proj);
      const pageParam = searchParams.get("page");
      const page =
        proj.pages?.find((p) => p.id === pageParam) || proj.pages?.[0];
      if (page) setActivePageId(page.id);
    });
  }, [projectId, searchParams]);

  if (!project) {
    return <div className="loading">Ładowanie podglądu...</div>;
  }

  const pages = project.pages || [];
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const modules = activePage?.modules || [];

  return (
    <div className="preview-page">
      <div className="preview-bar">
        <span>
          <span className="navbar-logo" style={{ fontSize: 13 }}>
            Podgląd
          </span>
          <span className="navbar-sep"> / </span>
          {project.name}
        </span>
        <div className="preview-bar-actions">
          <ThemeToggle />
          {pages.length > 1 && (
            <CustomSelect
              className="custom-select-inline"
              value={activePageId}
              onChange={setActivePageId}
              options={pages.map((p) => ({ value: p.id, label: p.name }))}
            />
          )}
          <Link to={`/editor/${projectId}`} className="btn btn-secondary">
            Wróć do edytora
          </Link>
        </div>
      </div>
      <div className="preview-content">
        {modules.length === 0 ? (
          <div className="canvas-empty">
            <p>Strona nie zawiera modułów</p>
          </div>
        ) : (
          modules.map((mod) => <ModuleRenderer key={mod.id} module={mod} />)
        )}
      </div>
    </div>
  );
}

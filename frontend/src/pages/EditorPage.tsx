import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import type { ModuleDefinition, Page, PageModule, Project } from "../types";
import { ModulePalette } from "../components/editor/ModulePalette";
import { EditorCanvas } from "../components/editor/EditorCanvas";
import { ConfigPanel } from "../components/editor/ConfigPanel";
import { PageTabs } from "../components/editor/PageTabs";
import { downloadHtml } from "../utils/htmlExport";
import { ThemeToggle } from "../components/ThemeToggle";
import { AppIcon } from "../components/icons/AppIcon";

function generateId() {
  return crypto.randomUUID();
}

export function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [catalog, setCatalog] = useState<ModuleDefinition[]>([]);
  const [activePageId, setActivePageId] = useState<string>("");
  const [modules, setModules] = useState<PageModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pages = project?.pages || [];
  const activePage = pages.find((p) => p.id === activePageId);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    const [proj, mods] = await Promise.all([
      api.projects.get(projectId),
      api.modules.list(),
    ]);
    setProject(proj);
    setCatalog(mods);
    setEditName(proj.name);
    setEditDescription(proj.description || "");
    const firstPage = proj.pages?.[0];
    if (firstPage) {
      setActivePageId(firstPage.id);
      setModules(firstPage.modules || []);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject().catch(() => navigate("/"));
  }, [loadProject, navigate]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = useCallback(async () => {
    if (!projectId || !activePageId) return false;
    setSaving(true);
    try {
      await api.projects.saveModules(projectId, activePageId, modules);
      setDirty(false);
      showMessage("Zapisano");
      return true;
    } catch {
      showMessage("Błąd zapisu");
      return false;
    } finally {
      setSaving(false);
    }
  }, [projectId, activePageId, modules]);

  useEffect(() => {
    if (!dirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave();
    }, 8000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [dirty, modules, handleSave]);

  const switchPage = async (pageId: string) => {
    if (pageId === activePageId) return;
    if (dirty && projectId && activePageId) {
      await api.projects.saveModules(projectId, activePageId, modules);
    }
    const page = pages.find((p) => p.id === pageId);
    setActivePageId(pageId);
    setModules(page?.modules || []);
    setSelectedId(null);
    setDirty(false);
  };

  const handleAddPage = async () => {
    if (!projectId) return;
    const name = prompt("Nazwa nowej strony:", "Nowa strona");
    if (!name?.trim()) return;
    if (dirty) await handleSave();
    const page = await api.projects.createPage(projectId, name.trim());
    setProject((prev) =>
      prev
        ? { ...prev, pages: [...(prev.pages || []), { ...page, modules: [] }] }
        : prev,
    );
    setActivePageId(page.id);
    setModules([]);
    setSelectedId(null);
    setDirty(false);
  };

  const handleDeletePage = async (pageId: string) => {
    if (!projectId || pages.length <= 1) return;
    const page = pages.find((p) => p.id === pageId);
    if (!confirm(`Usunąć stronę „${page?.name}"?`)) return;
    await api.projects.deletePage(projectId, pageId);
    const updated = await api.projects.get(projectId);
    setProject(updated);
    const nextPage = updated.pages?.[0];
    if (nextPage) {
      setActivePageId(nextPage.id);
      setModules(nextPage.modules || []);
    }
    setSelectedId(null);
    setDirty(false);
  };

  const handleAdd = (mod: ModuleDefinition) => {
    const newModule: PageModule = {
      id: generateId(),
      module_type: mod.type,
      config: structuredClone(mod.default_config),
      sort_order: modules.length,
      module_name: mod.name,
      module_icon: mod.icon,
    };
    setModules((prev) => [...prev, newModule]);
    setSelectedId(newModule.id);
    setDirty(true);
  };

  const handleDuplicate = (id: string) => {
    const source = modules.find((m) => m.id === id);
    if (!source) return;
    const copy: PageModule = {
      ...source,
      id: generateId(),
      config: structuredClone(source.config),
      sort_order: modules.length,
    };
    setModules((prev) => [...prev, copy]);
    setSelectedId(copy.id);
    setDirty(true);
  };

  const handleRemove = (id: string) => {
    setModules((prev) =>
      prev.filter((m) => m.id !== id).map((m, i) => ({ ...m, sort_order: i })),
    );
    if (selectedId === id) setSelectedId(null);
    setDirty(true);
  };

  const handleConfigChange = (config: Record<string, unknown>) => {
    if (!selectedId) return;
    setModules((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, config } : m)),
    );
    setDirty(true);
  };

  const handleBuildJson = async () => {
    if (!projectId) return;
    if (dirty) await handleSave();
    try {
      const build = await api.projects.build(projectId);
      const blob = new Blob([JSON.stringify(build, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "projekt"}-build.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("JSON pobrany");
    } catch {
      showMessage("Błąd eksportu");
    }
  };

  const handleBuildHtml = async () => {
    if (!projectId) return;
    if (dirty) await handleSave();
    try {
      const build = await api.projects.build(projectId);
      await downloadHtml(build, project?.name || "projekt");
      showMessage("ZIP z HTML/CSS/JS pobrany");
    } catch {
      showMessage("Błąd eksportu HTML");
    }
  };

  const handleSaveSettings = async () => {
    if (!projectId) return;
    try {
      const updated = await api.projects.update(projectId, {
        name: editName,
        description: editDescription,
      });
      setProject((prev) => (prev ? { ...prev, ...updated } : prev));
      setShowSettings(false);
      showMessage("Ustawienia zapisane");
    } catch {
      showMessage("Błąd zapisu ustawień");
    }
  };

  const selectedModule = modules.find((m) => m.id === selectedId) || null;

  if (!project) {
    return <div className="loading">Ładowanie edytora...</div>;
  }

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div className="editor-header-left">
          <Link to="/" className="btn-back">
            <AppIcon name="chevron-left" size={14} />
            Projekty
          </Link>
          <h1>{project.name}</h1>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setShowSettings(true)}
            title="Ustawienia projektu"
          >
            <AppIcon name="settings" size={16} />
          </button>
          {dirty && <span className="badge-dirty">Niezapisane</span>}
          {saving && <span className="badge-saving">Zapisywanie...</span>}
        </div>
        <div className="editor-header-actions">
          {message && <span className="toast">{message}</span>}
          <ThemeToggle />
          <div className="viewport-toggle">
            {(["desktop", "tablet", "mobile"] as const).map((v) => (
              <button
                key={v}
                type="button"
                className={viewport === v ? "active" : ""}
                onClick={() => setViewport(v)}
                title={v}
              >
                <AppIcon
                  name={
                    v === "desktop"
                      ? "monitor"
                      : v === "tablet"
                        ? "tablet"
                        : "smartphone"
                  }
                  size={15}
                />
              </button>
            ))}
          </div>
          <Link
            to={`/preview/${projectId}?page=${activePageId}`}
            className="btn btn-secondary btn-with-icon"
            target="_blank"
          >
            <AppIcon name="eye" size={14} />
            Podgląd
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-with-icon"
            onClick={handleBuildJson}
          >
            <AppIcon name="download" size={14} />
            JSON
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-with-icon"
            onClick={handleBuildHtml}
          >
            <AppIcon name="download" size={14} />
            HTML
          </button>
          <button
            type="button"
            className="btn btn-primary btn-with-icon"
            onClick={handleSave}
            disabled={saving || !dirty}
          >
            <AppIcon name="save" size={14} />
            Zapisz
          </button>
        </div>
      </header>

      <PageTabs
        pages={pages as Page[]}
        activePageId={activePageId}
        onSelect={switchPage}
        onAdd={handleAddPage}
        onDelete={handleDeletePage}
      />

      <div className="editor-body">
        <ModulePalette modules={catalog} onAdd={handleAdd} />
        <EditorCanvas
          modules={modules}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={(m) => {
            setModules(m);
            setDirty(true);
          }}
          onRemove={handleRemove}
          onDuplicate={handleDuplicate}
          viewport={viewport}
          pageName={activePage?.name}
        />
        <ConfigPanel module={selectedModule} onChange={handleConfigChange} />
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSettings();
            }}
          >
            <h2>Ustawienia projektu</h2>
            <label>
              Nazwa
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </label>
            <label>
              Opis
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSettings(false)}
              >
                Anuluj
              </button>
              <button type="submit" className="btn btn-primary">
                Zapisz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

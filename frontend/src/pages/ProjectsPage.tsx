import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { ThemeToggle } from "../components/ThemeToggle";
import { AppIcon, resolveIconName } from "../components/icons/AppIcon";
import { TEMPLATE_ICONS } from "../components/icons/iconRegistry";
import type { Project, TemplateDefinition } from "../types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("blank");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.projects.list(), api.templates.list()])
      .then(([projs, tmpls]) => {
        setProjects(projs);
        setTemplates(tmpls);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const project = await api.projects.create({
        name,
        description,
        template,
      });
      navigate(`/editor/${project.id}`);
    } catch {
      alert("Nie udało się utworzyć projektu");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, projectName: string) => {
    if (!confirm(`Usunąć projekt „${projectName}"?`)) return;
    await api.projects.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <nav className="navbar">
        <span className="navbar-logo">
          <AppIcon name="layout-grid" size={18} />
          Edytor Stron
        </span>
        <span className="navbar-sep">/</span>
        <span className="navbar-sub">Modułowy builder</span>
        <div className="navbar-actions">
          <ThemeToggle />
          <button
            className="btn btn-primary btn-with-icon"
            onClick={() => setShowForm(true)}
          >
            <AppIcon name="plus" size={14} />
            Nowy projekt
          </button>
        </div>
      </nav>

      <div className="projects-page">
        <header className="projects-header">
          <div>
            <h1 className="page-title">Twoje projekty</h1>
            <p className="page-subtitle">
              Twórz strony z 12 gotowych modułów — Dark Orange Glass
            </p>
          </div>
        </header>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <form
              className="modal modal-lg"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreate}
            >
              <h2>Nowy projekt</h2>
              <label>
                Nazwa projektu
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Strona firmowa"
                  autoFocus
                  required
                />
              </label>
              <label>
                Opis (opcjonalnie)
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Krótki opis projektu"
                  rows={2}
                />
              </label>
              <div className="template-picker">
                <span className="config-list-label">Szablon startowy</span>
                <div className="template-grid">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`template-card ${template === t.id ? "selected" : ""}`}
                      onClick={() => setTemplate(t.id)}
                    >
                      <span className="template-icon">
                        <AppIcon
                          name={
                            resolveIconName(TEMPLATE_ICONS[t.id] || t.icon) ||
                            "file"
                          }
                          size={22}
                        />
                      </span>
                      <strong>{t.name}</strong>
                      <small>{t.description}</small>
                      {t.modules.length > 0 && (
                        <span className="template-modules">
                          {t.modules.length} modułów
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? "Tworzenie..." : "Utwórz"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Ładowanie projektów...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h2>Brak projektów</h2>
            <p>
              Utwórz pierwszy projekt — wybierz szablon i zacznij budować stronę
            </p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-card-body">
                  <h3>{project.name}</h3>
                  {project.description && <p>{project.description}</p>}
                  <time>
                    Ostatnia zmiana:{" "}
                    {new Date(project.updated_at).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div className="project-card-actions">
                  <Link
                    to={`/editor/${project.id}`}
                    className="btn btn-primary"
                  >
                    Edytuj
                  </Link>
                  <Link
                    to={`/preview/${project.id}`}
                    className="btn btn-secondary"
                  >
                    Podgląd
                  </Link>
                  <button
                    className="btn btn-danger-outline btn-with-icon"
                    onClick={() => handleDelete(project.id, project.name)}
                  >
                    <AppIcon name="trash-2" size={14} />
                    Usuń
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

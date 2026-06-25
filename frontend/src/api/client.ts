const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Błąd serwera" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  modules: {
    list: () => request<import("../types").ModuleDefinition[]>("/modules"),
  },
  templates: {
    list: () => request<import("../types").TemplateDefinition[]>("/templates"),
  },
  projects: {
    list: () => request<import("../types").Project[]>("/projects"),
    get: (id: string) => request<import("../types").Project>(`/projects/${id}`),
    create: (data: { name: string; description?: string; template?: string }) =>
      request<import("../types").Project>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: { name: string; description?: string }) =>
      request<import("../types").Project>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/projects/${id}`, { method: "DELETE" }),
    createPage: (projectId: string, name: string) =>
      request<import("../types").Page>(`/projects/${projectId}/pages`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    deletePage: (projectId: string, pageId: string) =>
      request<void>(`/projects/${projectId}/pages/${pageId}`, {
        method: "DELETE",
      }),
    saveModules: (
      projectId: string,
      pageId: string,
      modules: Array<{
        id?: string;
        module_type: string;
        config: Record<string, unknown>;
        sort_order: number;
      }>,
    ) =>
      request<import("../types").PageModule[]>(
        `/projects/${projectId}/pages/${pageId}/modules`,
        { method: "PUT", body: JSON.stringify({ modules }) },
      ),
    build: (projectId: string) =>
      request<import("../types").BuildOutput>(`/projects/${projectId}/build`),
  },
};

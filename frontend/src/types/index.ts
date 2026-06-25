export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: Array<{ module_type: string }>;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  default_config: Record<string, unknown>;
}

export interface PageModule {
  id: string;
  page_id?: string;
  module_type: string;
  config: Record<string, unknown>;
  sort_order: number;
  module_name?: string;
  module_icon?: string;
}

export interface Page {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  sort_order: number;
  modules: PageModule[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  pages?: Page[];
}

export interface BuildOutput {
  project: { name: string; description: string };
  pages: Array<{
    name: string;
    slug: string;
    modules: Array<{ type: string; config: Record<string, unknown> }>;
  }>;
  generatedAt: string;
}

export type ViewportSize = "desktop" | "tablet" | "mobile";

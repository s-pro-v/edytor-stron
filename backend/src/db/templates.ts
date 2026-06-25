export interface TemplateModule {
  module_type: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: TemplateModule[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Pusty projekt",
    description: "Zacznij od czystej strony",
    icon: "file",
    modules: [],
  },
  {
    id: "landing",
    name: "Landing page",
    description: "Strona produktowa z CTA i opiniami",
    icon: "rocket",
    modules: [
      { module_type: "header" },
      { module_type: "hero" },
      { module_type: "features" },
      { module_type: "stats" },
      { module_type: "testimonials" },
      { module_type: "cta" },
      { module_type: "footer" },
    ],
  },
  {
    id: "business",
    name: "Strona firmowa",
    description: "Prezentacja firmy z kontaktem",
    icon: "building-2",
    modules: [
      { module_type: "header" },
      { module_type: "hero" },
      { module_type: "text" },
      { module_type: "features" },
      { module_type: "stats" },
      { module_type: "contact" },
      { module_type: "footer" },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Galeria prac i opis twórcy",
    icon: "palette",
    modules: [
      { module_type: "header" },
      { module_type: "hero" },
      { module_type: "gallery" },
      { module_type: "text" },
      { module_type: "contact" },
      { module_type: "footer" },
    ],
  },
  {
    id: "saas",
    name: "SaaS / Produkt",
    description: "Cennik, FAQ i sekcja CTA",
    icon: "gem",
    modules: [
      { module_type: "header" },
      { module_type: "hero" },
      { module_type: "features" },
      { module_type: "pricing" },
      { module_type: "faq" },
      { module_type: "cta" },
      { module_type: "footer" },
    ],
  },
];

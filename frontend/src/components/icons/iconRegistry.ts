/** Identyfikatory ikon Lucide (kebab-case) używane w całej aplikacji */

export type IconName =
  | "menu"
  | "target"
  | "file-text"
  | "sparkles"
  | "image"
  | "mail"
  | "arrow-down-to-line"
  | "megaphone"
  | "help-circle"
  | "message-square"
  | "credit-card"
  | "bar-chart-3"
  | "file"
  | "rocket"
  | "building-2"
  | "palette"
  | "gem"
  | "zap"
  | "wrench"
  | "tag"
  | "link"
  | "heading-1"
  | "heading-2"
  | "mouse-pointer-click"
  | "layout"
  | "align-left"
  | "contact"
  | "copyright"
  | "plus"
  | "x"
  | "chevron-up"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "grip-vertical"
  | "copy"
  | "settings"
  | "monitor"
  | "tablet"
  | "smartphone"
  | "sun"
  | "moon"
  | "layout-grid"
  | "trash-2"
  | "eye"
  | "download"
  | "save"
  | "star"
  | "heading-3"
  | "type"
  | "phone"
  | "map-pin"
  | "check"
  | "arrow-right"
  | "quote"
  | "send";

export const MODULE_ICONS: Record<string, IconName> = {
  header: "menu",
  hero: "target",
  text: "file-text",
  features: "sparkles",
  gallery: "image",
  contact: "mail",
  footer: "arrow-down-to-line",
  cta: "megaphone",
  faq: "help-circle",
  testimonials: "message-square",
  pricing: "credit-card",
  stats: "bar-chart-3",
};

export const TEMPLATE_ICONS: Record<string, IconName> = {
  blank: "file",
  landing: "rocket",
  business: "building-2",
  portfolio: "palette",
  saas: "gem",
};

export const FEATURE_ICON_OPTIONS: Array<{ value: IconName; label: string }> = [
  { value: "zap", label: "Błyskawica" },
  { value: "sparkles", label: "Iskry" },
  { value: "palette", label: "Paleta" },
  { value: "wrench", label: "Narzędzie" },
  { value: "star", label: "Gwiazda" },
  { value: "rocket", label: "Rakieta" },
  { value: "target", label: "Cel" },
  { value: "gem", label: "Diament" },
  { value: "bar-chart-3", label: "Wykres" },
  { value: "mail", label: "Email" },
  { value: "help-circle", label: "Pomoc" },
];

const LEGACY_EMOJI_MAP: Record<string, IconName> = {
  "☰": "menu",
  "🎯": "target",
  "📝": "file-text",
  "⭐": "sparkles",
  "🖼️": "image",
  "🖼": "image",
  "📧": "mail",
  "⬇️": "arrow-down-to-line",
  "⬇": "arrow-down-to-line",
  "📣": "megaphone",
  "❓": "help-circle",
  "💬": "message-square",
  "💰": "credit-card",
  "📊": "bar-chart-3",
  "📄": "file",
  "🚀": "rocket",
  "🏢": "building-2",
  "🎨": "palette",
  "💎": "gem",
  "⚡": "zap",
  "🔧": "wrench",
};

const VALID_ICONS = new Set<string>([
  ...Object.values(MODULE_ICONS),
  ...Object.values(TEMPLATE_ICONS),
  ...FEATURE_ICON_OPTIONS.map((o) => o.value),
  "tag",
  "link",
  "heading-1",
  "heading-2",
  "mouse-pointer-click",
  "layout",
  "align-left",
  "contact",
  "copyright",
  "plus",
  "x",
  "chevron-up",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "grip-vertical",
  "copy",
  "settings",
  "monitor",
  "tablet",
  "smartphone",
  "sun",
  "moon",
  "layout-grid",
  "trash-2",
  "eye",
  "download",
  "save",
  "star",
  "type",
  "heading-3",
  "phone",
  "map-pin",
  "check",
  "arrow-right",
  "quote",
  "send",
]);

export function resolveIconName(value?: string | null): IconName | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (LEGACY_EMOJI_MAP[trimmed]) return LEGACY_EMOJI_MAP[trimmed];
  if (VALID_ICONS.has(trimmed)) return trimmed as IconName;
  if (MODULE_ICONS[trimmed]) return MODULE_ICONS[trimmed];
  return null;
}

export function resolveModuleIcon(
  moduleType: string,
  storedIcon?: string | null,
): IconName {
  return (
    resolveIconName(storedIcon) || MODULE_ICONS[moduleType] || "layout-grid"
  );
}

export function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

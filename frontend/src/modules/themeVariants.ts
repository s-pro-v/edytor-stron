export type SectionVariant = "surface" | "elevated" | "primary" | "dark";

export const SECTION_VARIANTS: SectionVariant[] = [
  "surface",
  "elevated",
  "primary",
  "dark",
];

export const VARIANT_LABELS: Record<SectionVariant, string> = {
  surface: "Powierzchnia",
  elevated: "Podniesiona",
  primary: "Akcent (pomarańcz)",
  dark: "Ciemna",
};

export const VARIANT_INLINE_STYLES: Record<
  SectionVariant,
  { background: string; color: string }
> = {
  surface: { background: "#f5f2ed", color: "#1a0f05" },
  elevated: { background: "#f0e8dc", color: "#1a0f05" },
  primary: {
    background: "linear-gradient(135deg, #1a0f05 0%, #2d1810 45%, #3d2010 100%)",
    color: "#ffffff",
  },
  dark: { background: "#0a0a0a", color: "#e8e0d0" },
};

export function resolveExportColors(config: Record<string, unknown>) {
  const variant = (config.variant as SectionVariant) || "surface";
  const base = VARIANT_INLINE_STYLES[variant] || VARIANT_INLINE_STYLES.surface;
  return {
    background: (config.backgroundColor as string) || base.background,
    color: (config.textColor as string) || base.color,
  };
}

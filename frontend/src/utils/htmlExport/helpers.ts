import type { SectionVariant } from "../../modules/themeVariants";

export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sectionAttrs(
  config: Record<string, unknown>,
  classes: string[],
  extraStyle: Record<string, string> = {},
): string {
  const variant = (config.variant as SectionVariant) || "surface";
  const className = [...classes, "mod-section", `mod-section--${variant}`].join(
    " ",
  );

  const styleParts: string[] = [];
  if (config.backgroundColor) {
    styleParts.push(`background:${config.backgroundColor as string}`);
  }
  if (config.textColor) {
    styleParts.push(`color:${config.textColor as string}`);
  }
  for (const [key, value] of Object.entries(extraStyle)) {
    styleParts.push(`${key}:${value}`);
  }

  const styleAttr = styleParts.length
    ? ` style="${esc(styleParts.join(";"))}"`
    : "";

  return `class="${className}"${styleAttr}`;
}

export function paddingClass(config: Record<string, unknown>): string {
  const map: Record<string, string> = {
    small: "mod-padding-sm",
    medium: "mod-padding-md",
    large: "mod-padding-lg",
  };
  return map[(config.padding as string) || "large"] || "mod-padding-lg";
}

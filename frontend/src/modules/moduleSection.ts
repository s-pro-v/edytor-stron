import type { CSSProperties } from "react";
import { getSectionStyle } from "../utils/elementStyle";
import type { SectionVariant } from "./themeVariants";

export type { SectionVariant };

export function resolveSectionProps(
  config: Record<string, unknown>,
  baseClass: string,
  extraStyle: CSSProperties = {},
): { className: string; style: CSSProperties } {
  const variant = (config.variant as SectionVariant) || "surface";
  const style: CSSProperties = {
    ...extraStyle,
    ...getSectionStyle(config),
  };

  if (config.backgroundColor) {
    style.backgroundColor = config.backgroundColor as string;
  }
  if (config.textColor) {
    style.color = config.textColor as string;
  }

  return {
    className: `${baseClass} mod-section mod-section--${variant}`.trim(),
    style,
  };
}

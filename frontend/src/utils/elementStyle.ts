import type { CSSProperties } from "react";
import type { ElementStyle, SectionStyle } from "../types/styles";

export function elementStyleToCss(style?: ElementStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.fontSize) css.fontSize = style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight;
  if (style.color) css.color = style.color;
  if (style.textAlign) css.textAlign = style.textAlign as CSSProperties["textAlign"];
  if (style.lineHeight) css.lineHeight = style.lineHeight;
  if (style.letterSpacing) css.letterSpacing = style.letterSpacing;
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.borderRadius) css.borderRadius = style.borderRadius;
  if (style.padding) css.padding = style.padding;
  if (style.marginTop) css.marginTop = style.marginTop;
  if (style.marginBottom) css.marginBottom = style.marginBottom;
  if (style.opacity) css.opacity = parseFloat(style.opacity);
  if (style.borderWidth) css.borderWidth = style.borderWidth;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.borderStyle) css.borderStyle = style.borderStyle as CSSProperties["borderStyle"];
  if (style.maxWidth) css.maxWidth = style.maxWidth;
  if (style.textTransform) css.textTransform = style.textTransform as CSSProperties["textTransform"];
  if (style.fontStyle) css.fontStyle = style.fontStyle as CSSProperties["fontStyle"];
  if (style.textDecoration) css.textDecoration = style.textDecoration;
  if (style.boxShadow) css.boxShadow = style.boxShadow;
  return css;
}

export function sectionStyleToCss(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.paddingTop) css.paddingTop = style.paddingTop;
  if (style.paddingBottom) css.paddingBottom = style.paddingBottom;
  if (style.paddingLeft) css.paddingLeft = style.paddingLeft;
  if (style.paddingRight) css.paddingRight = style.paddingRight;
  if (style.minHeight) css.minHeight = style.minHeight;
  if (style.maxWidth) css.maxWidth = style.maxWidth;
  if (style.backgroundImage) css.backgroundImage = `url(${style.backgroundImage})`;
  if (style.backgroundSize) css.backgroundSize = style.backgroundSize;
  if (style.backgroundPosition) css.backgroundPosition = style.backgroundPosition;
  if (style.borderTop) css.borderTop = style.borderTop;
  if (style.borderBottom) css.borderBottom = style.borderBottom;
  return css;
}

export function getElementStyle(
  config: Record<string, unknown>,
  elementKey: string,
): CSSProperties {
  const styles = config.styles as Record<string, ElementStyle> | undefined;
  return elementStyleToCss(styles?.[elementKey]);
}

export function getSectionStyle(config: Record<string, unknown>): CSSProperties {
  return sectionStyleToCss(config.sectionStyle as SectionStyle | undefined);
}

export function mergeSectionStyles(
  config: Record<string, unknown>,
  base: CSSProperties = {},
): CSSProperties {
  const style: CSSProperties = { ...base, ...getSectionStyle(config) };
  if (config.backgroundColor) {
    style.backgroundColor = config.backgroundColor as string;
  }
  if (config.textColor) {
    style.color = config.textColor as string;
  }
  return style;
}

export function updateElementStyle(
  config: Record<string, unknown>,
  elementKey: string,
  patch: Partial<ElementStyle>,
): Record<string, unknown> {
  const styles = { ...((config.styles as Record<string, ElementStyle>) || {}) };
  styles[elementKey] = { ...(styles[elementKey] || {}), ...patch };
  return { ...config, styles };
}

export function updateSectionStyle(
  config: Record<string, unknown>,
  patch: Partial<SectionStyle>,
): Record<string, unknown> {
  const sectionStyle = { ...((config.sectionStyle as SectionStyle) || {}), ...patch };
  return { ...config, sectionStyle };
}

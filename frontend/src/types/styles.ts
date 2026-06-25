export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  marginTop?: string;
  marginBottom?: string;
  opacity?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  maxWidth?: string;
  textTransform?: string;
  fontStyle?: string;
  textDecoration?: string;
  boxShadow?: string;
}

export interface SectionStyle {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  minHeight?: string;
  maxWidth?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  borderTop?: string;
  borderBottom?: string;
}

export type StylesMap = Record<string, ElementStyle>;

export interface ModuleConfig extends Record<string, unknown> {
  styles?: StylesMap;
  sectionStyle?: SectionStyle;
}

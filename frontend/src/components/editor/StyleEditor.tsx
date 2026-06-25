import type { ElementStyle } from "../../types/styles";
import { ColorField, SelectField, Field } from "./ConfigFields";

const FONT_SIZES = [
  { value: "", label: "Domyślny" },
  { value: "12px", label: "12px — Bardzo mały" },
  { value: "14px", label: "14px — Mały" },
  { value: "16px", label: "16px — Normalny" },
  { value: "18px", label: "18px — Średni" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px — Duży" },
  { value: "28px", label: "28px" },
  { value: "32px", label: "32px — XL" },
  { value: "40px", label: "40px" },
  { value: "48px", label: "48px — 2XL" },
  { value: "56px", label: "56px — 3XL" },
  { value: "64px", label: "64px — Hero" },
];

const FONT_WEIGHTS = [
  { value: "", label: "Domyślna" },
  { value: "300", label: "300 — Cienka" },
  { value: "400", label: "400 — Normalna" },
  { value: "500", label: "500 — Medium" },
  { value: "600", label: "600 — Półgruba" },
  { value: "700", label: "700 — Gruba" },
  { value: "800", label: "800 — Extra gruba" },
  { value: "900", label: "900 — Black" },
];

const TEXT_ALIGNS = [
  { value: "", label: "Domyślne" },
  { value: "left", label: "Do lewej" },
  { value: "center", label: "Wyśrodkowane" },
  { value: "right", label: "Do prawej" },
  { value: "justify", label: "Wyjustowane" },
];

const BORDER_STYLES = [
  { value: "", label: "Brak" },
  { value: "solid", label: "Ciągła" },
  { value: "dashed", label: "Przerywana" },
  { value: "dotted", label: "Kropkowana" },
];

const TEXT_TRANSFORMS = [
  { value: "", label: "Brak" },
  { value: "uppercase", label: "WIELKIE LITERY" },
  { value: "lowercase", label: "małe litery" },
  { value: "capitalize", label: "Kapitaliki" },
];

interface Props {
  style: ElementStyle;
  onChange: (patch: Partial<ElementStyle>) => void;
  options?: {
    showTypography?: boolean;
    showColors?: boolean;
    showSpacing?: boolean;
    showBorder?: boolean;
    showEffects?: boolean;
  };
}

export function StyleEditor({
  style,
  onChange,
  options = {},
}: Props) {
  const {
    showTypography = true,
    showColors = true,
    showSpacing = true,
    showBorder = true,
    showEffects = true,
  } = options;

  const patch = (key: keyof ElementStyle, val: string) => {
    onChange({ [key]: val || undefined });
  };

  return (
    <div className="style-editor">
      {showTypography && (
        <div className="style-editor-group">
          <span className="style-editor-group-label">Typografia</span>
          <SelectField label="Rozmiar czcionki" value={style.fontSize || ""} options={FONT_SIZES} onChange={(v) => patch("fontSize", v)} />
          <SelectField label="Grubość" value={style.fontWeight || ""} options={FONT_WEIGHTS} onChange={(v) => patch("fontWeight", v)} />
          <SelectField label="Wyrównanie" value={style.textAlign || ""} options={TEXT_ALIGNS} onChange={(v) => patch("textAlign", v)} />
          <Field label="Wysokość linii" value={style.lineHeight || ""} onChange={(v) => patch("lineHeight", v)} />
          <Field label="Odstęp liter" value={style.letterSpacing || ""} onChange={(v) => patch("letterSpacing", v)} />
          <SelectField label="Transformacja" value={style.textTransform || ""} options={TEXT_TRANSFORMS} onChange={(v) => patch("textTransform", v)} />
          <SelectField label="Styl czcionki" value={style.fontStyle || ""} options={[{ value: "", label: "Normalny" }, { value: "italic", label: "Kursywa" }]} onChange={(v) => patch("fontStyle", v)} />
        </div>
      )}

      {showColors && (
        <div className="style-editor-group">
          <span className="style-editor-group-label">Kolory</span>
          <ColorField label="Kolor tekstu" value={style.color || "#000000"} onChange={(v) => patch("color", v)} />
          <ColorField label="Kolor tła elementu" value={style.backgroundColor || "#ffffff"} onChange={(v) => patch("backgroundColor", v)} />
        </div>
      )}

      {showSpacing && (
        <div className="style-editor-group">
          <span className="style-editor-group-label">Odstępy</span>
          <Field label="Padding (np. 12px 24px)" value={style.padding || ""} onChange={(v) => patch("padding", v)} />
          <Field label="Margines górny" value={style.marginTop || ""} onChange={(v) => patch("marginTop", v)} />
          <Field label="Margines dolny" value={style.marginBottom || ""} onChange={(v) => patch("marginBottom", v)} />
          <Field label="Maks. szerokość" value={style.maxWidth || ""} onChange={(v) => patch("maxWidth", v)} />
        </div>
      )}

      {showBorder && (
        <div className="style-editor-group">
          <span className="style-editor-group-label">Obramowanie</span>
          <Field label="Grubość obramowania" value={style.borderWidth || ""} onChange={(v) => patch("borderWidth", v)} />
          <ColorField label="Kolor obramowania" value={style.borderColor || "#e2e8f0"} onChange={(v) => patch("borderColor", v)} />
          <SelectField label="Styl obramowania" value={style.borderStyle || ""} options={BORDER_STYLES} onChange={(v) => patch("borderStyle", v)} />
          <Field label="Zaokrąglenie (np. 8px)" value={style.borderRadius || ""} onChange={(v) => patch("borderRadius", v)} />
        </div>
      )}

      {showEffects && (
        <div className="style-editor-group">
          <span className="style-editor-group-label">Efekty</span>
          <Field label="Przezroczystość (0–1)" value={style.opacity || ""} onChange={(v) => patch("opacity", v)} />
          <Field label="Cień (box-shadow)" value={style.boxShadow || ""} onChange={(v) => patch("boxShadow", v)} />
          <Field label="Dekoracja tekstu" value={style.textDecoration || ""} onChange={(v) => patch("textDecoration", v)} />
        </div>
      )}
    </div>
  );
}

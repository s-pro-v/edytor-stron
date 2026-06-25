import type { SectionStyle } from "../../types/styles";
import { Field, ColorField, SelectField } from "./ConfigFields";
import {
  SECTION_VARIANTS,
  VARIANT_LABELS,
  type SectionVariant,
} from "../../modules/themeVariants";

interface Props {
  style: SectionStyle;
  config: Record<string, unknown>;
  onSectionChange: (patch: Partial<SectionStyle>) => void;
  onConfigChange: (key: string, value: unknown) => void;
}

export function SectionStyleEditor({ style, config, onSectionChange, onConfigChange }: Props) {
  const patch = (key: keyof SectionStyle, val: string) => {
    onSectionChange({ [key]: val || undefined });
  };

  const variant = (config.variant as SectionVariant) || "surface";

  const clearColorOverride = (key: "backgroundColor" | "textColor") => {
    onConfigChange(key, undefined);
  };

  return (
    <div className="style-editor">
      <div className="style-editor-group">
        <span className="style-editor-group-label">Styl sekcji</span>
        <SelectField
          label="Wariant"
          value={variant}
          options={SECTION_VARIANTS.map((v) => ({
            value: v,
            label: VARIANT_LABELS[v],
          }))}
          onChange={(v) => onConfigChange("variant", v)}
        />
        <ColorField
          label="Nadpisanie tła (opcjonalne)"
          value={(config.backgroundColor as string) || "#f5f2ed"}
          onChange={(v) => onConfigChange("backgroundColor", v)}
        />
        {(config.backgroundColor as string) && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => clearColorOverride("backgroundColor")}
          >
            Przywróć tło wariantu
          </button>
        )}
        <ColorField
          label="Nadpisanie koloru tekstu (opcjonalne)"
          value={(config.textColor as string) || "#1a0f05"}
          onChange={(v) => onConfigChange("textColor", v)}
        />
        {(config.textColor as string) && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => clearColorOverride("textColor")}
          >
            Przywróć kolor wariantu
          </button>
        )}
      </div>

      <div className="style-editor-group">
        <span className="style-editor-group-label">Wymiary i odstępy</span>
        <Field label="Padding górny" value={style.paddingTop || ""} onChange={(v) => patch("paddingTop", v)} />
        <Field label="Padding dolny" value={style.paddingBottom || ""} onChange={(v) => patch("paddingBottom", v)} />
        <Field label="Padding lewy" value={style.paddingLeft || ""} onChange={(v) => patch("paddingLeft", v)} />
        <Field label="Padding prawy" value={style.paddingRight || ""} onChange={(v) => patch("paddingRight", v)} />
        <Field label="Min. wysokość" value={style.minHeight || ""} onChange={(v) => patch("minHeight", v)} />
        <Field label="Maks. szerokość kontenera" value={style.maxWidth || ""} onChange={(v) => patch("maxWidth", v)} />
      </div>

      <div className="style-editor-group">
        <span className="style-editor-group-label">Tło obrazem</span>
        <Field label="URL obrazu tła" value={style.backgroundImage || ""} onChange={(v) => patch("backgroundImage", v)} />
        <SelectField
          label="Rozmiar tła"
          value={style.backgroundSize || ""}
          options={[
            { value: "", label: "Domyślny" },
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "100% 100%", label: "Rozciągnij" },
          ]}
          onChange={(v) => patch("backgroundSize", v)}
        />
        <SelectField
          label="Pozycja tła"
          value={style.backgroundPosition || ""}
          options={[
            { value: "", label: "Domyślna" },
            { value: "center", label: "Środek" },
            { value: "top", label: "Góra" },
            { value: "bottom", label: "Dół" },
          ]}
          onChange={(v) => patch("backgroundPosition", v)}
        />
      </div>

      <div className="style-editor-group">
        <span className="style-editor-group-label">Obramowanie sekcji</span>
        <Field label="Border top (np. 1px solid #e2e8f0)" value={style.borderTop || ""} onChange={(v) => patch("borderTop", v)} />
        <Field label="Border bottom" value={style.borderBottom || ""} onChange={(v) => patch("borderBottom", v)} />
      </div>
    </div>
  );
}

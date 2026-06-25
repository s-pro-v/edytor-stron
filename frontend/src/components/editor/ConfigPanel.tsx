import { useState, type ReactNode } from "react";
import type { PageModule } from "../../types";
import type { ElementStyle, SectionStyle } from "../../types/styles";
import { CollapsibleSection } from "./CollapsibleSection";
import { StyleEditor } from "./StyleEditor";
import { SectionStyleEditor } from "./SectionStyleEditor";
import { AppIcon, resolveModuleIcon } from "../icons/AppIcon";
import {
  Field,
  SelectField,
  LinkListEditor,
  FeaturesListEditor,
  GalleryListEditor,
  FaqListEditor,
  TestimonialsListEditor,
  StatsListEditor,
  PricingListEditor,
} from "./ConfigFields";

interface Props {
  module: PageModule | null;
  onChange: (config: Record<string, unknown>) => void;
}

function getElementStyles(
  config: Record<string, unknown>,
  key: string,
): ElementStyle {
  const styles = config.styles as Record<string, ElementStyle> | undefined;
  return styles?.[key] || {};
}

function updateElementStyle(
  config: Record<string, unknown>,
  key: string,
  patch: Partial<ElementStyle>,
): Record<string, unknown> {
  const styles = { ...((config.styles as Record<string, ElementStyle>) || {}) };
  const current = { ...(styles[key] || {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === "") delete current[k as keyof ElementStyle];
    else (current as Record<string, string>)[k] = v;
  }
  if (Object.keys(current).length === 0) delete styles[key];
  else styles[key] = current;
  return { ...config, styles };
}

function ElementBlock({
  title,
  icon,
  elementKey,
  config,
  onChange,
  content,
  styleOptions,
  defaultOpen,
}: {
  title: string;
  icon?: string;
  elementKey: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
  content: ReactNode;
  styleOptions?: Parameters<typeof StyleEditor>[0]["options"];
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleSection title={title} icon={icon} defaultOpen={defaultOpen}>
      <div className="element-block">
        <div className="element-block-content">
          <span className="element-block-label">Treść</span>
          {content}
        </div>
        <div className="element-block-styles">
          <span className="element-block-label">Styl elementu</span>
          <StyleEditor
            style={getElementStyles(config, elementKey)}
            onChange={(patch) =>
              onChange(updateElementStyle(config, elementKey, patch))
            }
            options={styleOptions}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

export function ConfigPanel({ module, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<"elements" | "section">(
    "elements",
  );

  if (!module) {
    return (
      <aside className="config-panel config-panel-wide">
        <h2 className="panel-title">Konfiguracja</h2>
        <p className="panel-desc">
          Wybierz moduł, aby edytować elementy i style
        </p>
      </aside>
    );
  }

  const config = module.config;
  const update = (key: string, value: unknown) => {
    const next = { ...config };
    if (value === undefined || value === "") delete next[key];
    else next[key] = value;
    onChange(next);
  };
  const updateSection = (patch: Partial<SectionStyle>) => {
    const sectionStyle = {
      ...((config.sectionStyle as SectionStyle) || {}),
      ...patch,
    };
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "")
        delete (sectionStyle as Record<string, string>)[k];
    }
    onChange({ ...config, sectionStyle });
  };

  const renderModuleElements = () => {
    switch (module.module_type) {
      case "header":
        return (
          <>
            <ElementBlock
              title="Logo"
              icon="tag"
              elementKey="logo"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tekst logo"
                  value={(config.logo as string) || ""}
                  onChange={(v) => update("logo", v)}
                />
              }
              styleOptions={{
                showTypography: true,
                showColors: true,
                showSpacing: false,
                showBorder: false,
              }}
            />
            <CollapsibleSection title="Linki nawigacji" icon="link">
              <LinkListEditor
                label=""
                links={
                  (config.links as Array<{ label: string; href: string }>) || []
                }
                onChange={(v) => update("links", v)}
              />
              <div className="element-block-styles" style={{ marginTop: 12 }}>
                <span className="element-block-label">Styl linków</span>
                <StyleEditor
                  style={getElementStyles(config, "navLink")}
                  onChange={(p) =>
                    onChange(updateElementStyle(config, "navLink", p))
                  }
                  options={{
                    showTypography: true,
                    showColors: true,
                    showSpacing: true,
                    showBorder: false,
                    showEffects: true,
                  }}
                />
              </div>
            </CollapsibleSection>
          </>
        );

      case "hero":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-1"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tekst tytułu"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <ElementBlock
              title="Podtytuł"
              icon="heading-2"
              elementKey="subtitle"
              config={config}
              onChange={onChange}
              content={
                <Field
                  label="Tekst podtytułu"
                  value={(config.subtitle as string) || ""}
                  onChange={(v) => update("subtitle", v)}
                  multiline
                />
              }
            />
            <ElementBlock
              title="Przycisk CTA"
              icon="mouse-pointer-click"
              elementKey="button"
              config={config}
              onChange={onChange}
              content={
                <>
                  <Field
                    label="Tekst przycisku"
                    value={(config.buttonText as string) || ""}
                    onChange={(v) => update("buttonText", v)}
                  />
                  <Field
                    label="Link"
                    value={(config.buttonLink as string) || ""}
                    onChange={(v) => update("buttonLink", v)}
                  />
                </>
              }
              styleOptions={{
                showTypography: true,
                showColors: true,
                showSpacing: true,
                showBorder: true,
                showEffects: true,
              }}
            />
            <CollapsibleSection title="Układ sekcji" icon="layout">
              <SelectField
                label="Wyrównanie treści"
                value={(config.align as string) || "center"}
                options={[
                  { value: "left", label: "Lewo" },
                  { value: "center", label: "Środek" },
                  { value: "right", label: "Prawo" },
                ]}
                onChange={(v) => update("align", v)}
              />
            </CollapsibleSection>
          </>
        );

      case "text":
        return (
          <>
            <ElementBlock
              title="Nagłówek"
              icon="heading-2"
              elementKey="heading"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tekst nagłówka"
                  value={(config.heading as string) || ""}
                  onChange={(v) => update("heading", v)}
                />
              }
            />
            <ElementBlock
              title="Treść"
              icon="align-left"
              elementKey="content"
              config={config}
              onChange={onChange}
              content={
                <Field
                  label="Akapit"
                  value={(config.content as string) || ""}
                  onChange={(v) => update("content", v)}
                  multiline
                />
              }
            />
            <CollapsibleSection title="Odstępy sekcji" icon="layout">
              <SelectField
                label="Padding"
                value={(config.padding as string) || "large"}
                options={[
                  { value: "large", label: "Duży (72px)" },
                  { value: "medium", label: "Średni (48px)" },
                  { value: "small", label: "Mały (24px)" },
                ]}
                onChange={(v) => update("padding", v)}
              />
            </CollapsibleSection>
          </>
        );

      case "features":
        return (
          <>
            <ElementBlock
              title="Tytuł sekcji"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Elementy listy"
              icon="sparkles"
              defaultOpen
            >
              <FeaturesListEditor
                items={
                  (config.items as Array<{
                    icon: string;
                    title: string;
                    description: string;
                  }>) || []
                }
                onChange={(v) => update("items", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style elementów listy" icon="palette">
              <StyleEditor
                style={getElementStyles(config, "itemTitle")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "itemTitle", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Opis elementu
              </span>
              <StyleEditor
                style={getElementStyles(config, "itemDescription")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "itemDescription", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Ikona
              </span>
              <StyleEditor
                style={getElementStyles(config, "itemIcon")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "itemIcon", p))
                }
                options={{
                  showTypography: true,
                  showColors: false,
                  showSpacing: true,
                  showBorder: false,
                }}
              />
            </CollapsibleSection>
          </>
        );

      case "gallery":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł galerii"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection title="Zdjęcia" icon="image" defaultOpen>
              <GalleryListEditor
                images={
                  (config.images as Array<{ url: string; caption: string }>) ||
                  []
                }
                onChange={(v) => update("images", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style zdjęć i podpisów" icon="palette">
              <span className="element-block-label">Zdjęcie</span>
              <StyleEditor
                style={getElementStyles(config, "image")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "image", p))
                }
                options={{
                  showBorder: true,
                  showEffects: true,
                  showTypography: false,
                  showColors: false,
                  showSpacing: false,
                }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Podpis
              </span>
              <StyleEditor
                style={getElementStyles(config, "caption")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "caption", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
            </CollapsibleSection>
          </>
        );

      case "contact":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł sekcji"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Dane kontaktowe"
              icon="contact"
              defaultOpen
            >
              <Field
                label="Email"
                value={(config.email as string) || ""}
                onChange={(v) => update("email", v)}
              />
              <Field
                label="Telefon"
                value={(config.phone as string) || ""}
                onChange={(v) => update("phone", v)}
              />
              <Field
                label="Adres"
                value={(config.address as string) || ""}
                onChange={(v) => update("address", v)}
              />
              <div className="element-block-styles" style={{ marginTop: 12 }}>
                <span className="element-block-label">Styl danych</span>
                <StyleEditor
                  style={getElementStyles(config, "infoText")}
                  onChange={(p) =>
                    onChange(updateElementStyle(config, "infoText", p))
                  }
                />
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Formularz" icon="file-text">
              <span className="element-block-label">Pola formularza</span>
              <StyleEditor
                style={getElementStyles(config, "formInput")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "formInput", p))
                }
                options={{
                  showBorder: true,
                  showSpacing: true,
                  showColors: true,
                  showTypography: true,
                }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Przycisk wysyłki
              </span>
              <StyleEditor
                style={getElementStyles(config, "formButton")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "formButton", p))
                }
                options={{
                  showTypography: true,
                  showColors: true,
                  showSpacing: true,
                  showBorder: true,
                }}
              />
            </CollapsibleSection>
          </>
        );

      case "footer":
        return (
          <>
            <ElementBlock
              title="Copyright"
              icon="copyright"
              elementKey="copyright"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tekst copyright"
                  value={(config.copyright as string) || ""}
                  onChange={(v) => update("copyright", v)}
                />
              }
            />
            <CollapsibleSection title="Linki stopki" icon="link" defaultOpen>
              <LinkListEditor
                label=""
                links={
                  (config.links as Array<{ label: string; href: string }>) || []
                }
                onChange={(v) => update("links", v)}
              />
              <div className="element-block-styles" style={{ marginTop: 12 }}>
                <span className="element-block-label">Styl linków</span>
                <StyleEditor
                  style={getElementStyles(config, "link")}
                  onChange={(p) =>
                    onChange(updateElementStyle(config, "link", p))
                  }
                />
              </div>
            </CollapsibleSection>
          </>
        );

      case "cta":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <ElementBlock
              title="Podtytuł"
              icon="heading-3"
              elementKey="subtitle"
              config={config}
              onChange={onChange}
              content={
                <Field
                  label="Podtytuł"
                  value={(config.subtitle as string) || ""}
                  onChange={(v) => update("subtitle", v)}
                  multiline
                />
              }
            />
            <ElementBlock
              title="Przycisk"
              icon="mouse-pointer-click"
              elementKey="button"
              config={config}
              onChange={onChange}
              content={
                <>
                  <Field
                    label="Tekst"
                    value={(config.buttonText as string) || ""}
                    onChange={(v) => update("buttonText", v)}
                  />
                  <Field
                    label="Link"
                    value={(config.buttonLink as string) || ""}
                    onChange={(v) => update("buttonLink", v)}
                  />
                </>
              }
              styleOptions={{
                showTypography: true,
                showColors: true,
                showSpacing: true,
                showBorder: true,
              }}
            />
          </>
        );

      case "faq":
        return (
          <>
            <ElementBlock
              title="Tytuł sekcji"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Pytania i odpowiedzi"
              icon="help-circle"
              defaultOpen
            >
              <FaqListEditor
                items={
                  (config.items as Array<{
                    question: string;
                    answer: string;
                  }>) || []
                }
                onChange={(v) => update("items", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style FAQ" icon="palette">
              <span className="element-block-label">Pytanie</span>
              <StyleEditor
                style={getElementStyles(config, "question")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "question", p))
                }
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Odpowiedź
              </span>
              <StyleEditor
                style={getElementStyles(config, "answer")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "answer", p))
                }
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Karta pytania
              </span>
              <StyleEditor
                style={getElementStyles(config, "faqItem")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "faqItem", p))
                }
                options={{
                  showBorder: true,
                  showSpacing: true,
                  showColors: true,
                  showTypography: false,
                }}
              />
            </CollapsibleSection>
          </>
        );

      case "testimonials":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Opinie"
              icon="message-square"
              defaultOpen
            >
              <TestimonialsListEditor
                items={
                  (config.items as Array<{
                    name: string;
                    role: string;
                    quote: string;
                    avatar: string;
                  }>) || []
                }
                onChange={(v) => update("items", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style opinii" icon="palette">
              <StyleEditor
                style={getElementStyles(config, "quote")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "quote", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Imię autora
              </span>
              <StyleEditor
                style={getElementStyles(config, "name")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "name", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Karta opinii
              </span>
              <StyleEditor
                style={getElementStyles(config, "card")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "card", p))
                }
                options={{
                  showBorder: true,
                  showSpacing: true,
                  showColors: true,
                  showEffects: true,
                  showTypography: false,
                }}
              />
            </CollapsibleSection>
          </>
        );

      case "pricing":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Plany cenowe"
              icon="credit-card"
              defaultOpen
            >
              <PricingListEditor
                plans={
                  (config.plans as Array<{
                    name: string;
                    price: string;
                    period: string;
                    features: string[];
                    highlighted: boolean;
                  }>) || []
                }
                onChange={(v) => update("plans", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style cennika" icon="palette">
              <StyleEditor
                style={getElementStyles(config, "planName")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "planName", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Cena
              </span>
              <StyleEditor
                style={getElementStyles(config, "price")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "price", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Karta planu
              </span>
              <StyleEditor
                style={getElementStyles(config, "planCard")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "planCard", p))
                }
                options={{
                  showBorder: true,
                  showSpacing: true,
                  showColors: true,
                  showEffects: true,
                  showTypography: false,
                }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Przycisk planu
              </span>
              <StyleEditor
                style={getElementStyles(config, "planButton")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "planButton", p))
                }
                options={{
                  showTypography: true,
                  showColors: true,
                  showSpacing: true,
                  showBorder: true,
                }}
              />
            </CollapsibleSection>
          </>
        );

      case "stats":
        return (
          <>
            <ElementBlock
              title="Tytuł"
              icon="heading-2"
              elementKey="title"
              config={config}
              onChange={onChange}
              defaultOpen
              content={
                <Field
                  label="Tytuł"
                  value={(config.title as string) || ""}
                  onChange={(v) => update("title", v)}
                />
              }
            />
            <CollapsibleSection
              title="Statystyki"
              icon="bar-chart-3"
              defaultOpen
            >
              <StatsListEditor
                items={
                  (config.items as Array<{ value: string; label: string }>) ||
                  []
                }
                onChange={(v) => update("items", v)}
              />
            </CollapsibleSection>
            <CollapsibleSection title="Style liczb" icon="palette">
              <StyleEditor
                style={getElementStyles(config, "value")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "value", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
              <span
                className="element-block-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Etykieta
              </span>
              <StyleEditor
                style={getElementStyles(config, "label")}
                onChange={(p) =>
                  onChange(updateElementStyle(config, "label", p))
                }
                options={{ showTypography: true, showColors: true }}
              />
            </CollapsibleSection>
          </>
        );

      default:
        return <p>Brak konfiguracji dla tego modułu</p>;
    }
  };

  return (
    <aside className="config-panel config-panel-wide">
      <h2 className="panel-title panel-title-with-icon">
        <AppIcon
          name={resolveModuleIcon(module.module_type, module.module_icon)}
          size={18}
        />
        {module.module_name || module.module_type}
      </h2>

      <div className="config-tabs">
        <button
          type="button"
          className={activeTab === "elements" ? "active" : ""}
          onClick={() => setActiveTab("elements")}
        >
          Elementy
        </button>
        <button
          type="button"
          className={activeTab === "section" ? "active" : ""}
          onClick={() => setActiveTab("section")}
        >
          Sekcja
        </button>
      </div>

      <div className="config-fields">
        {activeTab === "elements" ? (
          renderModuleElements()
        ) : (
          <SectionStyleEditor
            style={(config.sectionStyle as SectionStyle) || {}}
            config={config}
            onSectionChange={updateSection}
            onConfigChange={update}
          />
        )}
      </div>
    </aside>
  );
}

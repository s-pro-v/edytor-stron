import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { ModButtonLink } from "./ModuleUi";

interface Props {
  config: Record<string, unknown>;
}

export function CtaModule({ config }: Props) {
  const title = (config.title as string) || "";
  const subtitle = (config.subtitle as string) || "";
  const buttonText = (config.buttonText as string) || "";
  const buttonLink = (config.buttonLink as string) || "#";
  const { className, style } = resolveSectionProps(
    config,
    "mod-cta mod-padding-lg",
  );

  return (
    <section className={className} style={style}>
      <div className="mod-container mod-cta-inner">
        <h2 className="mod-cta-title" style={getElementStyle(config, "title")}>
          {title}
        </h2>
        {subtitle && (
          <p
            className="mod-cta-subtitle"
            style={getElementStyle(config, "subtitle")}
          >
            {subtitle}
          </p>
        )}
        {buttonText && (
          <ModButtonLink
            href={buttonLink}
            className="mod-cta-btn"
            style={getElementStyle(config, "button")}
          >
            {buttonText}
          </ModButtonLink>
        )}
      </div>
    </section>
  );
}

import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { ModButtonLink } from "./ModuleUi";

interface Props {
  config: Record<string, unknown>;
}

export function HeroModule({ config }: Props) {
  const title = (config.title as string) || "";
  const subtitle = (config.subtitle as string) || "";
  const buttonText = (config.buttonText as string) || "";
  const buttonLink = (config.buttonLink as string) || "#";
  const align = (config.align as string) || "center";
  const buttonStyle = getElementStyle(config, "button");
  const { className, style } = resolveSectionProps(config, "mod-hero");

  return (
    <section
      className={className}
      style={{
        ...style,
        textAlign: align as React.CSSProperties["textAlign"],
      }}
    >
      <div className="mod-container">
        <h1 className="mod-hero-title" style={getElementStyle(config, "title")}>
          {title}
        </h1>
        <p
          className="mod-hero-subtitle"
          style={getElementStyle(config, "subtitle")}
        >
          {subtitle}
        </p>
        {buttonText && (
          <ModButtonLink
            href={buttonLink}
            className="mod-hero-btn"
            style={buttonStyle}
          >
            {buttonText}
          </ModButtonLink>
        )}
      </div>
    </section>
  );
}

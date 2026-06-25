import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";

interface Props {
  config: Record<string, unknown>;
}

const PADDING_MAP: Record<string, string> = {
  large: "mod-padding-lg",
  medium: "mod-padding-md",
  small: "mod-padding-sm",
};

export function TextModule({ config }: Props) {
  const heading = (config.heading as string) || "";
  const content = (config.content as string) || "";
  const padding = PADDING_MAP[(config.padding as string) || "large"] || "mod-padding-lg";
  const { className, style } = resolveSectionProps(config, `mod-text ${padding}`);

  return (
    <section className={className} style={style}>
      <div className="mod-container">
        {heading && <h2 className="mod-text-heading" style={getElementStyle(config, "heading")}>{heading}</h2>}
        <p className="mod-text-content" style={getElementStyle(config, "content")}>{content}</p>
      </div>
    </section>
  );
}

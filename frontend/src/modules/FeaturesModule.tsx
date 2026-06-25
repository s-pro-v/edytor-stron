import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { AppIcon } from "../components/icons/AppIcon";

interface Props {
  config: Record<string, unknown>;
}

export function FeaturesModule({ config }: Props) {
  const title = (config.title as string) || "";
  const items =
    (config.items as Array<{
      icon: string;
      title: string;
      description: string;
    }>) || [];
  const { className, style } = resolveSectionProps(
    config,
    "mod-features mod-padding-lg",
  );

  return (
    <section className={className} style={style}>
      <div className="mod-container">
        {title && (
          <h2
            className="mod-section-title"
            style={getElementStyle(config, "title")}
          >
            {title}
          </h2>
        )}
        <div className="mod-features-grid">
          {items.map((item, i) => (
            <div key={i} className="mod-feature-card">
              <span
                className="mod-feature-icon"
                style={getElementStyle(config, "itemIcon")}
              >
                <AppIcon name={item.icon} size={40} strokeWidth={1.75} />
              </span>
              <h3 style={getElementStyle(config, "itemTitle")}>{item.title}</h3>
              <p style={getElementStyle(config, "itemDescription")}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

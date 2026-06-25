import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";

interface Props {
  config: Record<string, unknown>;
}

export function StatsModule({ config }: Props) {
  const title = (config.title as string) || "";
  const items = (config.items as Array<{ value: string; label: string }>) || [];
  const { className, style } = resolveSectionProps(config, "mod-stats mod-padding-lg");

  return (
    <section className={className} style={style}>
      <div className="mod-container">
        {title && <h2 className="mod-section-title" style={getElementStyle(config, "title")}>{title}</h2>}
        <div className="mod-stats-grid">
          {items.map((item, i) => (
            <div key={i} className="mod-stat-item">
              <div className="mod-stat-value" style={getElementStyle(config, "value")}>{item.value}</div>
              <div className="mod-stat-label" style={getElementStyle(config, "label")}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

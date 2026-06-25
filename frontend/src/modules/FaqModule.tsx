import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { AppIcon } from "../components/icons/AppIcon";

interface Props {
  config: Record<string, unknown>;
}

export function FaqModule({ config }: Props) {
  const title = (config.title as string) || "";
  const items =
    (config.items as Array<{ question: string; answer: string }>) || [];
  const itemStyle = getElementStyle(config, "faqItem");
  const { className, style } = resolveSectionProps(
    config,
    "mod-faq mod-padding-lg",
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
        <div className="mod-faq-list">
          {items.map((item, i) => (
            <details key={i} className="mod-faq-item" style={itemStyle}>
              <summary style={getElementStyle(config, "question")}>
                <span className="mod-faq-summary">
                  <AppIcon
                    name="help-circle"
                    size={16}
                    className="mod-faq-summary-icon"
                  />
                  <span>{item.question}</span>
                </span>
              </summary>
              <p style={getElementStyle(config, "answer")}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

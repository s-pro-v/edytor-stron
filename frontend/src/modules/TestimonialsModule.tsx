import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { AppIcon } from "../components/icons/AppIcon";

interface Props {
  config: Record<string, unknown>;
}

export function TestimonialsModule({ config }: Props) {
  const title = (config.title as string) || "";
  const items =
    (config.items as Array<{
      name: string;
      role: string;
      quote: string;
      avatar: string;
    }>) || [];
  const cardStyle = getElementStyle(config, "card");
  const { className, style } = resolveSectionProps(
    config,
    "mod-testimonials mod-padding-lg",
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
        <div className="mod-testimonials-grid">
          {items.map((item, i) => (
            <blockquote
              key={i}
              className="mod-testimonial-card"
              style={cardStyle}
            >
              <AppIcon
                name="quote"
                size={22}
                className="mod-testimonial-mark"
              />
              <p
                className="mod-testimonial-quote"
                style={getElementStyle(config, "quote")}
              >
                {item.quote}
              </p>
              <footer>
                <span className="mod-testimonial-avatar">{item.avatar}</span>
                <div>
                  <strong style={getElementStyle(config, "name")}>
                    {item.name}
                  </strong>
                  <span>{item.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

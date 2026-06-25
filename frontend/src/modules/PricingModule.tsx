import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { ModCheckItem } from "./ModuleUi";

interface Props {
  config: Record<string, unknown>;
}

export function PricingModule({ config }: Props) {
  const title = (config.title as string) || "";
  const plans =
    (config.plans as Array<{
      name: string;
      price: string;
      period: string;
      features: string[];
      highlighted: boolean;
    }>) || [];
  const cardStyle = getElementStyle(config, "planCard");
  const buttonStyle = getElementStyle(config, "planButton");
  const { className, style } = resolveSectionProps(
    config,
    "mod-pricing mod-padding-lg",
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
        <div className="mod-pricing-grid">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`mod-pricing-card ${plan.highlighted ? "highlighted" : ""}`}
              style={cardStyle}
            >
              <h3 style={getElementStyle(config, "planName")}>{plan.name}</h3>
              <div
                className="mod-pricing-price"
                style={getElementStyle(config, "price")}
              >
                <span className="mod-pricing-amount">{plan.price}</span>
                <span className="mod-pricing-period">zł / {plan.period}</span>
              </div>
              <ul>
                {plan.features.map((f, j) => (
                  <ModCheckItem key={j}>{f}</ModCheckItem>
                ))}
              </ul>
              <button type="button" style={buttonStyle}>
                Wybierz plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

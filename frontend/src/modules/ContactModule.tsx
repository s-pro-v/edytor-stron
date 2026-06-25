import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";
import { ModIconLine } from "./ModuleUi";
import { AppIcon } from "../components/icons/AppIcon";

interface Props {
  config: Record<string, unknown>;
}

export function ContactModule({ config }: Props) {
  const title = (config.title as string) || "";
  const email = (config.email as string) || "";
  const phone = (config.phone as string) || "";
  const address = (config.address as string) || "";
  const infoStyle = getElementStyle(config, "infoText");
  const inputStyle = getElementStyle(config, "formInput");
  const buttonStyle = getElementStyle(config, "formButton");
  const { className, style } = resolveSectionProps(
    config,
    "mod-contact mod-padding-lg",
  );

  return (
    <section className={className} style={style}>
      <div className="mod-container mod-contact-inner">
        <div className="mod-contact-info">
          {title && (
            <h2
              className="mod-section-title mod-section-title--left"
              style={getElementStyle(config, "title")}
            >
              {title}
            </h2>
          )}
          {email && (
            <ModIconLine icon="mail" style={infoStyle}>
              {email}
            </ModIconLine>
          )}
          {phone && (
            <ModIconLine icon="phone" style={infoStyle}>
              {phone}
            </ModIconLine>
          )}
          {address && (
            <ModIconLine icon="map-pin" style={infoStyle}>
              {address}
            </ModIconLine>
          )}
        </div>
        <form className="mod-contact-form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Imię i nazwisko" style={inputStyle} />
          <input type="email" placeholder="Email" style={inputStyle} />
          <textarea placeholder="Wiadomość" rows={4} style={inputStyle} />
          <button
            type="submit"
            className="mod-btn-with-icon"
            style={buttonStyle}
          >
            <span>Wyślij</span>
            <AppIcon name="send" size={16} strokeWidth={2.25} />
          </button>
        </form>
      </div>
    </section>
  );
}

import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";

interface Props {
  config: Record<string, unknown>;
}

export function FooterModule({ config }: Props) {
  const copyright = (config.copyright as string) || "";
  const links = (config.links as Array<{ label: string; href: string }>) || [];
  const linkStyle = getElementStyle(config, "link");
  const { className, style } = resolveSectionProps(config, "mod-footer");

  return (
    <footer className={className} style={style}>
      <div className="mod-container mod-footer-inner">
        <p style={getElementStyle(config, "copyright")}>{copyright}</p>
        <nav className="mod-footer-nav">
          {links.map((link, i) => (
            <a key={i} href={link.href} style={linkStyle}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

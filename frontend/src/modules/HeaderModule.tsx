import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";

interface Props {
  config: Record<string, unknown>;
}

export function HeaderModule({ config }: Props) {
  const logo = (config.logo as string) || "Logo";
  const links = (config.links as Array<{ label: string; href: string }>) || [];
  const navLinkStyle = getElementStyle(config, "navLink");
  const { className, style } = resolveSectionProps(config, "mod-header");

  return (
    <header className={className} style={style}>
      <div className="mod-container mod-header-inner">
        <div className="mod-header-logo" style={getElementStyle(config, "logo")}>{logo}</div>
        <nav className="mod-header-nav">
          {links.map((link, i) => (
            <a key={i} href={link.href} style={navLinkStyle}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

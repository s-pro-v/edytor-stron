import type { CSSProperties, ReactNode } from "react";
import { AppIcon } from "../components/icons/AppIcon";
import type { IconName } from "../components/icons/iconRegistry";

interface ModIconLineProps {
  icon: IconName;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ModIconLine({
  icon,
  children,
  className = "",
  style,
}: ModIconLineProps) {
  return (
    <p className={`mod-icon-line ${className}`.trim()} style={style}>
      <span className="mod-icon-line-icon" aria-hidden="true">
        <AppIcon name={icon} size={16} strokeWidth={2} />
      </span>
      <span className="mod-icon-line-text">{children}</span>
    </p>
  );
}

interface ModButtonLinkProps {
  href: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function ModButtonLink({
  href,
  className,
  style,
  children,
}: ModButtonLinkProps) {
  return (
    <a
      href={href}
      className={`mod-btn-with-icon ${className}`.trim()}
      style={style}
    >
      <span>{children}</span>
      <AppIcon name="arrow-right" size={16} strokeWidth={2.25} />
    </a>
  );
}

interface ModCheckItemProps {
  children: ReactNode;
}

export function ModCheckItem({ children }: ModCheckItemProps) {
  return (
    <li className="mod-check-item">
      <AppIcon
        name="check"
        size={15}
        strokeWidth={2.5}
        className="mod-check-icon"
      />
      <span>{children}</span>
    </li>
  );
}

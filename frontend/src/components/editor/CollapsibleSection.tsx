import { useState } from "react";
import type { ReactNode } from "react";
import { AppIcon } from "../icons/AppIcon";
import type { IconName } from "../icons/iconRegistry";

interface Props {
  title: string;
  icon?: IconName | string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-section ${open ? "open" : ""}`}>
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setOpen(!open)}
      >
        <span className="collapsible-header-title">
          {icon && (
            <AppIcon name={icon} size={14} className="collapsible-icon" />
          )}
          {title}
        </span>
        <AppIcon
          name="chevron-down"
          size={14}
          className={`collapsible-chevron ${open ? "is-open" : ""}`}
        />
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}

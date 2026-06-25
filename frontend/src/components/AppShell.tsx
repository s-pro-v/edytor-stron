import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  ambient?: boolean;
}

export function AppShell({ children, ambient = true }: Props) {
  return (
    <div className="app-shell">
      {ambient && (
        <div className="ambient" aria-hidden="true">
          <div className="ambient-1" />
          <div className="ambient-2" />
        </div>
      )}
      <div className="app-shell-content">{children}</div>
    </div>
  );
}

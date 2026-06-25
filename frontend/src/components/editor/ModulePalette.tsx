import type { ModuleDefinition } from "../../types";
import { AppIcon, resolveModuleIcon } from "../icons/AppIcon";

interface Props {
  modules: ModuleDefinition[];
  onAdd: (module: ModuleDefinition) => void;
}

export function ModulePalette({ modules, onAdd }: Props) {
  return (
    <aside className="palette">
      <h2 className="panel-title">Moduły</h2>
      <p className="panel-desc">Kliknij, aby dodać moduł do strony</p>
      <div className="palette-list">
        {modules.map((mod) => (
          <button
            key={mod.id}
            className="palette-item"
            onClick={() => onAdd(mod)}
            title={mod.description}
          >
            <span className="palette-icon">
              <AppIcon name={resolveModuleIcon(mod.type, mod.icon)} size={18} />
            </span>
            <div className="palette-info">
              <strong>{mod.name}</strong>
              <small>{mod.description}</small>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

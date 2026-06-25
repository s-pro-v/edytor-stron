import type { Page } from "../../types";
import { AppIcon } from "../icons/AppIcon";

interface Props {
  pages: Page[];
  activePageId: string;
  onSelect: (pageId: string) => void;
  onAdd: () => void;
  onDelete: (pageId: string) => void;
}

export function PageTabs({
  pages,
  activePageId,
  onSelect,
  onAdd,
  onDelete,
}: Props) {
  return (
    <div className="page-tabs">
      {pages.map((page) => (
        <div
          key={page.id}
          className={`page-tab ${page.id === activePageId ? "active" : ""}`}
        >
          <button type="button" onClick={() => onSelect(page.id)}>
            {page.name}
          </button>
          {pages.length > 1 && (
            <button
              type="button"
              className="page-tab-delete"
              onClick={() => onDelete(page.id)}
              title="Usuń stronę"
            >
              <AppIcon name="x" size={12} />
            </button>
          )}
        </div>
      ))}
      <button type="button" className="page-tab-add" onClick={onAdd}>
        <AppIcon name="plus" size={14} />
        Strona
      </button>
    </div>
  );
}

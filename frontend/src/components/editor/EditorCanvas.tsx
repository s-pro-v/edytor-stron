import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PageModule, ViewportSize } from "../../types";
import { ModuleRenderer } from "../../modules/ModuleRenderer";
import { AppIcon, resolveModuleIcon } from "../icons/AppIcon";

interface Props {
  modules: PageModule[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (modules: PageModule[]) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  viewport: ViewportSize;
  pageName?: string;
}

const VIEWPORT_WIDTH: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function SortableModule({
  module,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: {
  module: PageModule;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`canvas-module ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="canvas-module-toolbar">
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Przeciągnij"
        >
          <AppIcon name="grip-vertical" size={14} />
        </button>
        <span className="canvas-module-label">
          <AppIcon
            name={resolveModuleIcon(module.module_type, module.module_icon)}
            size={14}
          />
          {module.module_name || module.module_type}
        </span>
        <button
          type="button"
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplikuj"
        >
          <AppIcon name="copy" size={14} />
        </button>
        <button
          type="button"
          className="btn-icon btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Usuń moduł"
        >
          <AppIcon name="x" size={14} />
        </button>
      </div>
      <ModuleRenderer module={module} isEditing />
    </div>
  );
}

export function EditorCanvas({
  modules,
  selectedId,
  onSelect,
  onReorder,
  onRemove,
  onDuplicate,
  viewport,
  pageName,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...modules];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(reordered.map((m, i) => ({ ...m, sort_order: i })));
  };

  return (
    <main className="canvas">
      <div className="canvas-header">
        <h2 className="panel-title">{pageName || "Podgląd strony"}</h2>
        <span className="canvas-module-count">{modules.length} modułów</span>
      </div>
      <div className="canvas-viewport-wrap">
        <div
          className={`canvas-viewport viewport-${viewport}`}
          style={{ width: VIEWPORT_WIDTH[viewport] }}
        >
          {modules.length === 0 ? (
            <div className="canvas-empty">
              <p>Strona jest pusta</p>
              <p>Dodaj moduły z panelu po lewej stronie</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={modules.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="canvas-modules">
                  {modules.map((mod) => (
                    <SortableModule
                      key={mod.id}
                      module={mod}
                      isSelected={selectedId === mod.id}
                      onSelect={() => onSelect(mod.id)}
                      onRemove={() => onRemove(mod.id)}
                      onDuplicate={() => onDuplicate(mod.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  );
}

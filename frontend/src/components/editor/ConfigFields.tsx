import { CustomSelect } from "../CustomSelect";
import { AppIcon } from "../icons/AppIcon";
import { FEATURE_ICON_OPTIONS } from "../icons/iconRegistry";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <label className="config-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="config-field config-color">
      <span>{label}</span>
      <div className="color-input-wrap">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <label className="config-field">
      <span>{label}</span>
      <CustomSelect value={value} options={options} onChange={onChange} />
    </label>
  );
}

function ListItemActions({
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="list-item-actions">
      <button
        type="button"
        className="btn-icon"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        title="W górę"
      >
        <AppIcon name="chevron-up" size={14} />
      </button>
      <button
        type="button"
        className="btn-icon"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        title="W dół"
      >
        <AppIcon name="chevron-down" size={14} />
      </button>
      <button
        type="button"
        className="btn-icon btn-danger"
        onClick={onRemove}
        title="Usuń"
      >
        <AppIcon name="x" size={14} />
      </button>
    </div>
  );
}

function reorderList<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function LinkListEditor({
  label,
  links,
  onChange,
}: {
  label: string;
  links: Array<{ label: string; href: string }>;
  onChange: (links: Array<{ label: string; href: string }>) => void;
}) {
  const update = (index: number, key: "label" | "href", val: string) => {
    const next = links.map((l, i) => (i === index ? { ...l, [key]: val } : l));
    onChange(next);
  };

  return (
    <div className="config-list">
      <span className="config-list-label">{label}</span>
      {links.map((link, i) => (
        <div key={i} className="config-list-item">
          <input
            placeholder="Etykieta"
            value={link.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <input
            placeholder="URL"
            value={link.href}
            onChange={(e) => update(i, "href", e.target.value)}
          />
          <ListItemActions
            canMoveUp={i > 0}
            canMoveDown={i < links.length - 1}
            onMoveUp={() => onChange(reorderList(links, i, -1))}
            onMoveDown={() => onChange(reorderList(links, i, 1))}
            onRemove={() => onChange(links.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => onChange([...links, { label: "Link", href: "#" }])}
      >
        + Dodaj link
      </button>
    </div>
  );
}

export function FeaturesListEditor({
  items,
  onChange,
}: {
  items: Array<{ icon: string; title: string; description: string }>;
  onChange: (
    items: Array<{ icon: string; title: string; description: string }>,
  ) => void;
}) {
  const update = (index: number, key: string, val: string) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [key]: val } : item)),
    );
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Elementy</span>
      {items.map((item, i) => (
        <div key={i} className="config-list-item config-list-item-stack">
          <div className="config-list-item-header">
            <span className="config-list-item-index">#{i + 1}</span>
            <ListItemActions
              canMoveUp={i > 0}
              canMoveDown={i < items.length - 1}
              onMoveUp={() => onChange(reorderList(items, i, -1))}
              onMoveDown={() => onChange(reorderList(items, i, 1))}
              onRemove={() => onChange(items.filter((_, j) => j !== i))}
            />
          </div>
          <SelectField
            label="Ikona"
            value={item.icon || "sparkles"}
            options={FEATURE_ICON_OPTIONS}
            onChange={(v) => update(i, "icon", v)}
          />
          <input
            placeholder="Tytuł"
            value={item.title}
            onChange={(e) => update(i, "title", e.target.value)}
          />
          <textarea
            placeholder="Opis"
            value={item.description}
            onChange={(e) => update(i, "description", e.target.value)}
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([
            ...items,
            { icon: "sparkles", title: "Nowa cecha", description: "Opis" },
          ])
        }
      >
        + Dodaj element
      </button>
    </div>
  );
}

export function GalleryListEditor({
  images,
  onChange,
}: {
  images: Array<{ url: string; caption: string }>;
  onChange: (images: Array<{ url: string; caption: string }>) => void;
}) {
  const update = (index: number, key: "url" | "caption", val: string) => {
    onChange(
      images.map((img, i) => (i === index ? { ...img, [key]: val } : img)),
    );
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Zdjęcia</span>
      {images.map((img, i) => (
        <div key={i} className="config-list-item config-list-item-stack">
          <input
            placeholder="URL zdjęcia"
            value={img.url}
            onChange={(e) => update(i, "url", e.target.value)}
          />
          <input
            placeholder="Podpis"
            value={img.caption}
            onChange={(e) => update(i, "caption", e.target.value)}
          />
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([
            ...images,
            { url: "https://picsum.photos/400/300", caption: "Nowe zdjęcie" },
          ])
        }
      >
        + Dodaj zdjęcie
      </button>
    </div>
  );
}

export function FaqListEditor({
  items,
  onChange,
}: {
  items: Array<{ question: string; answer: string }>;
  onChange: (items: Array<{ question: string; answer: string }>) => void;
}) {
  const update = (index: number, key: "question" | "answer", val: string) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [key]: val } : item)),
    );
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Pytania</span>
      {items.map((item, i) => (
        <div key={i} className="config-list-item config-list-item-stack">
          <input
            placeholder="Pytanie"
            value={item.question}
            onChange={(e) => update(i, "question", e.target.value)}
          />
          <textarea
            placeholder="Odpowiedź"
            value={item.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            rows={2}
          />
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([
            ...items,
            { question: "Nowe pytanie?", answer: "Odpowiedź" },
          ])
        }
      >
        + Dodaj pytanie
      </button>
    </div>
  );
}

export function TestimonialsListEditor({
  items,
  onChange,
}: {
  items: Array<{ name: string; role: string; quote: string; avatar: string }>;
  onChange: (
    items: Array<{ name: string; role: string; quote: string; avatar: string }>,
  ) => void;
}) {
  const update = (index: number, key: string, val: string) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [key]: val } : item)),
    );
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Opinie</span>
      {items.map((item, i) => (
        <div key={i} className="config-list-item config-list-item-stack">
          <input
            placeholder="Inicjały"
            value={item.avatar}
            onChange={(e) => update(i, "avatar", e.target.value)}
          />
          <input
            placeholder="Imię"
            value={item.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <input
            placeholder="Stanowisko"
            value={item.role}
            onChange={(e) => update(i, "role", e.target.value)}
          />
          <textarea
            placeholder="Cytat"
            value={item.quote}
            onChange={(e) => update(i, "quote", e.target.value)}
            rows={2}
          />
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([
            ...items,
            {
              name: "Klient",
              role: "Firma",
              quote: "Świetna usługa!",
              avatar: "KL",
            },
          ])
        }
      >
        + Dodaj opinię
      </button>
    </div>
  );
}

export function StatsListEditor({
  items,
  onChange,
}: {
  items: Array<{ value: string; label: string }>;
  onChange: (items: Array<{ value: string; label: string }>) => void;
}) {
  const update = (index: number, key: "value" | "label", val: string) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, [key]: val } : item)),
    );
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Statystyki</span>
      {items.map((item, i) => (
        <div key={i} className="config-list-item">
          <input
            placeholder="Wartość"
            value={item.value}
            onChange={(e) => update(i, "value", e.target.value)}
          />
          <input
            placeholder="Etykieta"
            value={item.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([...items, { value: "100+", label: "Nowa statystyka" }])
        }
      >
        + Dodaj statystykę
      </button>
    </div>
  );
}

export function PricingListEditor({
  plans,
  onChange,
}: {
  plans: Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted: boolean;
  }>;
  onChange: (
    plans: Array<{
      name: string;
      price: string;
      period: string;
      features: string[];
      highlighted: boolean;
    }>,
  ) => void;
}) {
  const updatePlan = (index: number, key: string, val: unknown) => {
    onChange(plans.map((p, i) => (i === index ? { ...p, [key]: val } : p)));
  };

  return (
    <div className="config-list">
      <span className="config-list-label">Plany cenowe</span>
      {plans.map((plan, i) => (
        <div key={i} className="config-list-item config-list-item-stack">
          <input
            placeholder="Nazwa planu"
            value={plan.name}
            onChange={(e) => updatePlan(i, "name", e.target.value)}
          />
          <div className="config-list-item">
            <input
              placeholder="Cena"
              value={plan.price}
              onChange={(e) => updatePlan(i, "price", e.target.value)}
            />
            <input
              placeholder="Okres (mies.)"
              value={plan.period}
              onChange={(e) => updatePlan(i, "period", e.target.value)}
            />
          </div>
          <textarea
            placeholder="Funkcje (jedna na linię)"
            value={plan.features.join("\n")}
            onChange={(e) =>
              updatePlan(
                i,
                "features",
                e.target.value.split("\n").filter(Boolean),
              )
            }
            rows={3}
          />
          <label className="config-checkbox">
            <input
              type="checkbox"
              checked={plan.highlighted}
              onChange={(e) => updatePlan(i, "highlighted", e.target.checked)}
            />
            Wyróżniony plan
          </label>
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onChange(plans.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() =>
          onChange([
            ...plans,
            {
              name: "Nowy plan",
              price: "99",
              period: "mies.",
              features: ["Funkcja 1"],
              highlighted: false,
            },
          ])
        }
      >
        + Dodaj plan
      </button>
    </div>
  );
}

export function ColorFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <>
      <ColorField
        label="Tło"
        value={(config.backgroundColor as string) || "#ffffff"}
        onChange={(v) => onChange("backgroundColor", v)}
      />
      {"textColor" in config && (
        <ColorField
          label="Tekst"
          value={(config.textColor as string) || "#1e293b"}
          onChange={(v) => onChange("textColor", v)}
        />
      )}
    </>
  );
}

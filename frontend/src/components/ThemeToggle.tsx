import { useTheme } from "../hooks/useTheme";
import { AppIcon } from "./icons/AppIcon";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      title="Zmień motyw"
    >
      <AppIcon name={theme === "dark" ? "sun" : "moon"} size={15} />
      <span>{theme === "dark" ? "Jasny" : "Ciemny"}</span>
    </button>
  );
}

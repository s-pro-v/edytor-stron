import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const savedTheme = localStorage.getItem("editor-theme") || "dark";
document.documentElement.setAttribute("theme", savedTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

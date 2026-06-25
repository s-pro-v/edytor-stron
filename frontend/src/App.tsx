import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProjectsPage } from "./pages/ProjectsPage";
import { EditorPage } from "./pages/EditorPage";
import { PreviewPage } from "./pages/PreviewPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
    >
      <AppShell>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/editor/:projectId" element={<EditorPage />} />
          <Route path="/preview/:projectId" element={<PreviewPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;

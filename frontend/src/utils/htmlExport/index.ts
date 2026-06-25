import JSZip from "jszip";
import type { BuildOutput } from "../../types";
import exportStyles from "./assets/style.css?raw";
import exportScript from "./assets/main.js?raw";
import { renderPageHtml } from "./render";

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]+/g, "-").trim() || "projekt";
}

export async function downloadHtml(
  build: BuildOutput,
  projectName: string,
): Promise<void> {
  const zip = new JSZip();
  const folderName = sanitizeFilename(projectName);

  zip.file(`${folderName}/css/style.css`, exportStyles);
  zip.file(`${folderName}/js/main.js`, exportScript);

  for (const page of build.pages) {
    const filename = page.slug === "index" ? "index.html" : `${page.slug}.html`;
    zip.file(
      `${folderName}/${filename}`,
      renderPageHtml(build.project.name, page),
    );
  }

  zip.file(
    `${folderName}/README.txt`,
    [
      `${build.project.name}`,
      "",
      "Struktura:",
      "  index.html     — strona główna",
      "  css/style.css  — style",
      "  js/main.js     — skrypty (formularz, nawigacja)",
      "",
      `Wygenerowano: ${build.generatedAt}`,
    ].join("\n"),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${folderName}.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** @deprecated Użyj downloadHtml — zwraca opis plików do podglądu */
export function buildHtml(build: BuildOutput): string {
  return build.pages
    .map((page) => {
      const filename =
        page.slug === "index" ? "index.html" : `${page.slug}.html`;
      return `<!-- FILE: ${filename} -->\n${renderPageHtml(build.project.name, page)}`;
    })
    .join("\n\n");
}

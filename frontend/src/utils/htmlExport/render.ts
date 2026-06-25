import { esc, paddingClass, sectionAttrs } from "./helpers";
import { renderModuleIconSvg } from "./featureIconSvg";

function iconLine(icon: string, text: string): string {
  return `<p class="mod-icon-line"><span class="mod-icon-line-icon">${renderModuleIconSvg(icon)}</span><span class="mod-icon-line-text">${esc(text)}</span></p>`;
}

function checkItem(text: string): string {
  return `<li class="mod-check-item"><span class="mod-check-icon">${renderModuleIconSvg("check")}</span><span>${esc(text)}</span></li>`;
}

function buttonLink(href: string, className: string, text: string): string {
  return `<a href="${esc(href)}" class="mod-btn-with-icon ${className}"><span>${esc(text)}</span>${renderModuleIconSvg("arrow-right")}</a>`;
}

export function renderModule(
  type: string,
  config: Record<string, unknown>,
): string {
  switch (type) {
    case "header": {
      const links =
        (config.links as Array<{ label: string; href: string }>) || [];
      return `<header ${sectionAttrs(config, ["mod-header"])}>
  <div class="mod-container mod-header-inner">
    <div class="mod-header-logo">${esc((config.logo as string) || "")}</div>
    <nav class="mod-header-nav">
      ${links.map((link) => `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join("\n      ")}
    </nav>
  </div>
</header>`;
    }
    case "hero": {
      const align = (config.align as string) || "center";
      return `<section ${sectionAttrs(config, ["mod-hero", `mod-hero--${align}`])}>
  <div class="mod-container">
    <h1 class="mod-hero-title">${esc((config.title as string) || "")}</h1>
    <p class="mod-hero-subtitle">${esc((config.subtitle as string) || "")}</p>
    ${config.buttonText ? buttonLink((config.buttonLink as string) || "#", "mod-hero-btn", (config.buttonText as string) || "") : ""}
  </div>
</section>`;
    }
    case "text":
      return `<section ${sectionAttrs(config, ["mod-text", paddingClass(config)])}>
  <div class="mod-container">
    <h2 class="mod-text-heading">${esc((config.heading as string) || "")}</h2>
    <p class="mod-text-content">${esc((config.content as string) || "")}</p>
  </div>
</section>`;
    case "features": {
      const items =
        (config.items as Array<{
          icon: string;
          title: string;
          description: string;
        }>) || [];
      return `<section ${sectionAttrs(config, ["mod-features", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-features-grid">
      ${items
        .map(
          (item) => `<article class="mod-feature-card">
        <span class="mod-feature-icon">${renderModuleIconSvg(item.icon)}</span>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
      </article>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    case "gallery": {
      const images =
        (config.images as Array<{ url: string; caption: string }>) || [];
      return `<section ${sectionAttrs(config, ["mod-gallery", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-gallery-grid">
      ${images
        .map(
          (img) => `<figure class="mod-gallery-item">
        <img src="${esc(img.url)}" alt="${esc(img.caption)}" loading="lazy">
        <figcaption>${esc(img.caption)}</figcaption>
      </figure>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    case "contact": {
      const email = (config.email as string) || "";
      const phone = (config.phone as string) || "";
      const address = (config.address as string) || "";
      return `<section ${sectionAttrs(config, ["mod-contact", "mod-padding-lg"])}>
  <div class="mod-container mod-contact-inner">
    <div class="mod-contact-info">
      <h2 class="mod-section-title mod-section-title--left">${esc((config.title as string) || "")}</h2>
      ${email ? iconLine("mail", email) : ""}
      ${phone ? iconLine("phone", phone) : ""}
      ${address ? iconLine("map-pin", address) : ""}
    </div>
    <form class="mod-contact-form" data-contact-form novalidate>
      <input type="text" name="name" placeholder="Imię i nazwisko" required>
      <input type="email" name="email" placeholder="Email" required>
      <textarea name="message" placeholder="Wiadomość" rows="4" required></textarea>
      <button type="submit" class="mod-btn-with-icon"><span>Wyślij</span>${renderModuleIconSvg("send")}</button>
      <p class="form-message" hidden></p>
    </form>
  </div>
</section>`;
    }
    case "footer": {
      const links =
        (config.links as Array<{ label: string; href: string }>) || [];
      return `<footer ${sectionAttrs(config, ["mod-footer"])}>
  <div class="mod-container mod-footer-inner">
    <p>${esc((config.copyright as string) || "")}</p>
    <nav class="mod-footer-nav">
      ${links.map((link) => `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join("\n      ")}
    </nav>
  </div>
</footer>`;
    }
    case "cta":
      return `<section ${sectionAttrs(config, ["mod-cta", "mod-padding-lg"])}>
  <div class="mod-container mod-cta-inner">
    <h2 class="mod-cta-title">${esc((config.title as string) || "")}</h2>
    <p class="mod-cta-subtitle">${esc((config.subtitle as string) || "")}</p>
    ${config.buttonText ? buttonLink((config.buttonLink as string) || "#", "mod-cta-btn", (config.buttonText as string) || "") : ""}
  </div>
</section>`;
    case "faq": {
      const items =
        (config.items as Array<{ question: string; answer: string }>) || [];
      return `<section ${sectionAttrs(config, ["mod-faq", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-faq-list">
      ${items
        .map(
          (item) => `<details class="mod-faq-item">
        <summary><span class="mod-faq-summary"><span class="mod-faq-summary-icon">${renderModuleIconSvg("help-circle")}</span><span>${esc(item.question)}</span></span></summary>
        <p>${esc(item.answer)}</p>
      </details>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    case "testimonials": {
      const items =
        (config.items as Array<{
          name: string;
          role: string;
          quote: string;
          avatar: string;
        }>) || [];
      return `<section ${sectionAttrs(config, ["mod-testimonials", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-testimonials-grid">
      ${items
        .map(
          (item) => `<blockquote class="mod-testimonial-card">
        <span class="mod-testimonial-mark">${renderModuleIconSvg("quote")}</span>
        <p class="mod-testimonial-quote">${esc(item.quote)}</p>
        <footer>
          <span class="mod-testimonial-avatar">${esc(item.avatar)}</span>
          <div>
            <strong>${esc(item.name)}</strong>
            <span>${esc(item.role)}</span>
          </div>
        </footer>
      </blockquote>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    case "pricing": {
      const plans =
        (config.plans as Array<{
          name: string;
          price: string;
          period: string;
          features: string[];
          highlighted: boolean;
        }>) || [];
      return `<section ${sectionAttrs(config, ["mod-pricing", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-pricing-grid">
      ${plans
        .map(
          (
            plan,
          ) => `<article class="mod-pricing-card${plan.highlighted ? " highlighted" : ""}">
        <h3>${esc(plan.name)}</h3>
        <div class="mod-pricing-price">
          <span class="mod-pricing-amount">${esc(plan.price)}</span>
          <span class="mod-pricing-period">zł / ${esc(plan.period)}</span>
        </div>
        <ul>
          ${plan.features.map((feature) => checkItem(feature)).join("\n          ")}
        </ul>
        <button type="button">Wybierz plan</button>
      </article>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    case "stats": {
      const items =
        (config.items as Array<{ value: string; label: string }>) || [];
      return `<section ${sectionAttrs(config, ["mod-stats", "mod-padding-lg"])}>
  <div class="mod-container">
    <h2 class="mod-section-title">${esc((config.title as string) || "")}</h2>
    <div class="mod-stats-grid">
      ${items
        .map(
          (item) => `<div class="mod-stat-item">
        <div class="mod-stat-value">${esc(item.value)}</div>
        <div class="mod-stat-label">${esc(item.label)}</div>
      </div>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
    }
    default:
      return `<!-- nieznany moduł: ${esc(type)} -->`;
  }
}

export function renderPageHtml(
  projectName: string,
  page: {
    name: string;
    slug: string;
    modules: Array<{ type: string; config: Record<string, unknown> }>;
  },
): string {
  const body = page.modules
    .map((mod) => renderModule(mod.type, mod.config))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(projectName)} — ${esc(page.name)}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="site">
${body}
  <script src="js/main.js"></script>
</body>
</html>`;
}

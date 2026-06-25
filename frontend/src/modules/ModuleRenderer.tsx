import type { ComponentType } from "react";
import type { PageModule } from "../types";
import { HeaderModule } from "./HeaderModule";
import { HeroModule } from "./HeroModule";
import { TextModule } from "./TextModule";
import { FeaturesModule } from "./FeaturesModule";
import { GalleryModule } from "./GalleryModule";
import { ContactModule } from "./ContactModule";
import { FooterModule } from "./FooterModule";
import { CtaModule } from "./CtaModule";
import { FaqModule } from "./FaqModule";
import { TestimonialsModule } from "./TestimonialsModule";
import { PricingModule } from "./PricingModule";
import { StatsModule } from "./StatsModule";

const MODULE_MAP: Record<
  string,
  ComponentType<{ config: Record<string, unknown> }>
> = {
  header: HeaderModule,
  hero: HeroModule,
  text: TextModule,
  features: FeaturesModule,
  gallery: GalleryModule,
  contact: ContactModule,
  footer: FooterModule,
  cta: CtaModule,
  faq: FaqModule,
  testimonials: TestimonialsModule,
  pricing: PricingModule,
  stats: StatsModule,
};

interface ModuleRendererProps {
  module: PageModule;
  isEditing?: boolean;
}

export function ModuleRenderer({ module, isEditing }: ModuleRendererProps) {
  const Component = MODULE_MAP[module.module_type];
  if (!Component) {
    return (
      <div className="module-unknown">Nieznany moduł: {module.module_type}</div>
    );
  }
  return (
    <div className={`module-wrapper mod-site${isEditing ? " editing" : ""}`}>
      <Component config={module.config} />
    </div>
  );
}

export { MODULE_MAP };

import { getElementStyle } from "../utils/elementStyle";
import { resolveSectionProps } from "./moduleSection";

interface Props {
  config: Record<string, unknown>;
}

export function GalleryModule({ config }: Props) {
  const title = (config.title as string) || "";
  const images = (config.images as Array<{ url: string; caption: string }>) || [];
  const imageStyle = getElementStyle(config, "image");
  const captionStyle = getElementStyle(config, "caption");
  const { className, style } = resolveSectionProps(config, "mod-gallery mod-padding-lg");

  return (
    <section className={className} style={style}>
      <div className="mod-container">
        {title && <h2 className="mod-section-title" style={getElementStyle(config, "title")}>{title}</h2>}
        <div className="mod-gallery-grid">
          {images.map((img, i) => (
            <figure key={i} className="mod-gallery-item">
              <img src={img.url} alt={img.caption} loading="lazy" style={imageStyle} />
              {img.caption && <figcaption style={captionStyle}>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

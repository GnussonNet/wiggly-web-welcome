import { useEffect } from "react";
import { DEFAULT_SHARE_IMAGE, SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH, SITE_ORIGIN, type PageMetadata } from "@/lib/page-metadata";

export function usePageMetadata({ title, description, path, article = false, noindex = false, image = DEFAULT_SHARE_IMAGE, imageAlt = title }: PageMetadata) {
  useEffect(() => {
    document.title = title;
    const set = (attribute: "name" | "property", key: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    set("name", "description", description);
    set("name", "twitter:title", title);
    set("name", "twitter:description", description);
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:image", SITE_ORIGIN + image);
    set("name", "twitter:image:alt", imageAlt);
    set("property", "og:image", SITE_ORIGIN + image);
    set("property", "og:image:alt", imageAlt);
    set("property", "og:image:type", "image/png");
    set("property", "og:image:width", String(SHARE_IMAGE_WIDTH));
    set("property", "og:image:height", String(SHARE_IMAGE_HEIGHT));
    set("property", "og:title", title);
    set("property", "og:description", description);
    set("property", "og:url", SITE_ORIGIN + path);
    set("property", "og:type", article ? "article" : "website");
    set("name", "robots", noindex ? "noindex, follow" : "index, follow");
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = SITE_ORIGIN + path;
  }, [title, description, path, article, noindex, image, imageAlt]);
}

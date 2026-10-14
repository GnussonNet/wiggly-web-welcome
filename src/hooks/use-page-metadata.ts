import { useEffect } from "react";
import { SITE_ORIGIN, type PageMetadata } from "@/lib/page-metadata";

export function usePageMetadata({ title, description, path, article = false, noindex = false }: PageMetadata) {
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
  }, [title, description, path, article, noindex]);
}

export type PageMetadata = { title: string; description: string; path: string; article?: boolean; noindex?: boolean };
export const HOME_METADATA: PageMetadata = {
  title: "Daggmask — Privacy Tools for Photos, Links & Calendars",
  description: "Remove photo metadata, clean tracking links, inspect redirects, and filter calendar feeds with Daggmask's simple, focused web tools.",
  path: "/",
};
export const BLOG_METADATA: PageMetadata = {
  title: "Security Case Studies & Project Notes — Daggmask",
  description: "Accessible case studies about the security decisions, tradeoffs, limitations, and tests behind Daggmask's tools.",
  path: "/blog",
};
export const SITE_ORIGIN = "https://daggmask.com";

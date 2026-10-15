import type { Post } from "./blog";
import { PROJECTS } from "./projects";

export type PageMetadata = { title: string; description: string; path: string; article?: boolean; noindex?: boolean; image?: string; imageAlt?: string; imageTitle?: string; imageLabel?: string };
export const DEFAULT_SHARE_IMAGE = "/social/home.png";
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;
export function postMetadata(post: Post): PageMetadata {
  return {
    title: `${post.title} — Daggmask`, description: post.description,
    path: `/blog/${post.slug}`, article: true,
    image: `/social/blog/${post.slug}.png`, imageAlt: `${post.title} — Daggmask`,
    imageTitle: post.title,
    imageLabel: `${PROJECTS.find(project => project.id === post.project)!.name} / Notes from the build`,
  };
}
export const HOME_METADATA: PageMetadata = {
  title: "Daggmask — Privacy Tools for Photos, Links & Calendars",
  description: "Remove photo metadata, clean tracking links, inspect redirects, and filter calendar feeds with Daggmask's simple, focused web tools.",
  path: "/",
  imageTitle: "Quiet tools.\nMore control.",
  imageLabel: "Photos / Links / Calendars",
};
export const BLOG_METADATA: PageMetadata = {
  title: "Security Case Studies & Project Notes — Daggmask",
  description: "Accessible case studies about the security decisions, tradeoffs, limitations, and tests behind Daggmask's tools.",
  path: "/blog",
  image: "/social/blog.png",
  imageTitle: "Notes from\nthe build.",
  imageLabel: "Security / Decisions / Project notes",
};
export const SITE_ORIGIN = "https://daggmask.com";

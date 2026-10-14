import { parse } from "yaml";
import { PROJECTS, type ProjectId } from "./projects";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  project: ProjectId;
  body: string;
  readingMinutes: number;
};

export function parsePost(source: string, filename: string): Post {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter in ${filename}`);
  const metadata = parse(match[1]);
  const slug = filename.split("/").at(-1)!.replace(/\.md$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid post filename: ${filename}`);
  for (const key of ["title", "description", "date", "project"]) {
    if (typeof metadata?.[key] !== "string" || !metadata[key].trim()) throw new Error(`Missing ${key} in ${filename}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || !Number.isFinite(Date.parse(`${metadata.date}T00:00:00Z`)) || new Date(`${metadata.date}T00:00:00Z`).toISOString().slice(0, 10) !== metadata.date) {
    throw new Error(`Invalid date in ${filename}`);
  }
  if (!PROJECTS.some((project) => project.id === metadata.project)) throw new Error(`Unknown project in ${filename}`);
  if (!match[2].trim()) throw new Error(`Empty post in ${filename}`);
  return {
    slug, title: metadata.title, description: metadata.description,
    date: metadata.date, project: metadata.project, body: match[2].trim(),
    readingMinutes: Math.max(1, Math.ceil(match[2].trim().split(/\s+/).length / 220)),
  };
}

const sources = import.meta.glob<string>("../content/blog/*.md", { query: "?raw", import: "default", eager: true });
export const POSTS = Object.entries(sources).map(([filename, source]) => parsePost(source, filename))
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
export const postHref = (post: Post) => `/blog/${post.slug}`;
// Chosen independently of publication order; change this slug to feature another post.
export const FEATURED_POST = POSTS.find((post) => post.slug === "trace-redirect-safety") ?? POSTS[0];
export const formatPostDate = (date: string) => new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Blog from "./Blog";
import BlogPost from "./BlogPost";
import { POSTS } from "@/lib/blog";
import { SITE_ORIGIN } from "@/lib/page-metadata";

vi.mock("@/components/WormLogo", () => ({ default: () => <a href="/">Daggmask home</a> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const renderPost = (slug: string) => render(<MemoryRouter initialEntries={[`/blog/${slug}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
</MemoryRouter>);

it("lists all posts in publication order with article titles as headings", () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Blog /></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1, name: "Notes from the build." })).toBeInTheDocument();
  expect(screen.getByRole("list", { name: "All posts, newest first" })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(POSTS.map((post) => post.title));
  expect(screen.getByRole("link", { name: /Why Burrow uses AI to suggest rules/ })).toHaveAttribute("href", "/blog/burrow-ai-and-saved-rules");
  expect(screen.getByRole("link", { name: /How Loam removes metadata without recompressing your photo/ })).toHaveAttribute("href", "/blog/loam-metadata-without-recompression");
  expect(screen.getByRole("link", { name: /Why Trace won’t follow every link/ })).toHaveAttribute("href", "/blog/trace-redirect-safety");
  expect(document.title).toBe("Security Case Studies & Project Notes — Daggmask");
});

it("renders a readable case study with article metadata and the implemented limitations", () => {
  renderPost("trace-redirect-safety");
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 2, name: "Checking DNS once is not enough" })).toBeInTheDocument();
  expect(screen.getByText(/not an independent security audit/)).toBeInTheDocument();
  expect(screen.getByText(/source repository will be linked here/)).toBeInTheDocument();
  expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute("content", "article");
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://daggmask.com/blog/trace-redirect-safety");
  expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute("href", "/blog");
});

it("shows a real not-found state instead of a misleading article for an unknown slug", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  renderPost("not-a-post");
  expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

it("updates social images between posts and resets them on the blog listing", () => {
  render(<MemoryRouter initialEntries={[`/blog/${POSTS[0].slug}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
  </MemoryRouter>);
  const expectImage = (image: string) => {
    expect(document.head.querySelector('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute("content", SITE_ORIGIN + image);
    expect(document.head.querySelector('meta[name="twitter:image"]')).toHaveAttribute("content", SITE_ORIGIN + image);
  };
  for (const post of POSTS) {
    fireEvent.click(screen.getByRole("link", { name: "All posts" }));
    expectImage("/social/blog.png");
    fireEvent.click(screen.getByRole("link", { name: new RegExp(post.title) }));
    expectImage(`/social/blog/${post.slug}.png`);
    expect(document.head.querySelector('meta[property="og:image:alt"]')).toHaveAttribute("content", `${post.title} — Daggmask`);
  }
});

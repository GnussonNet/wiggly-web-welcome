import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Blog from "./Blog";
import BlogPost from "./BlogPost";

vi.mock("@/components/WormLogo", () => ({ default: () => <a href="/">Daggmask home</a> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const renderPost = (slug: string) => render(<MemoryRouter initialEntries={[`/blog/${slug}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
</MemoryRouter>);

it("groups the published article under Trace without empty tool sections", () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Blog /></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1, name: "Notes from the build." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: "Trace" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { level: 2, name: "Loam" })).not.toBeInTheDocument();
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

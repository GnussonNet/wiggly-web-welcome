import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Index from "./Index";
import { FEATURED_POST, postHref } from "@/lib/blog";

vi.mock("@/components/Worm", () => ({ default: () => <div data-testid="hero-worm" /> }));
vi.mock("@/components/WormLogo", () => ({ default: () => <a href="/" aria-label="daggmask.com home">Logo</a> }));
vi.mock("@/components/ToolDemo", () => ({ default: ({ name }: { name: string }) => <figure aria-label={`${name} example`} /> }));
afterEach(cleanup);

it("introduces the tools with dedicated, accessible sections and the existing destinations", () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes><Route element={<SiteLayout />}><Route index element={<Index />} /></Route></Routes></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Keep control of what you share.");
  const nav = screen.getByRole("navigation", { name: "Main navigation" });
  expect(within(nav).getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/#tools");
  expect(within(nav).getAllByRole("link")).toHaveLength(2);
  expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  for (const name of ["Burrow", "Loam", "Trace"]) {
    const id = name.toLowerCase();
    const section = screen.getByRole("region", { name });
    expect(within(section).getByRole("heading", { level: 3, name })).toBeInTheDocument();
    const link = within(section).getByRole("link", { name: new RegExp(`Open ${name}`) });
    expect(link).toHaveAttribute("href", `https://${id}.daggmask.com`);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(section).getByRole("figure", { name: `${name} example` })).toBeVisible();
  }
  expect(screen.getByRole("region", { name: "Keep control of what you share." })).toContainElement(screen.getByTestId("hero-worm"));
  expect([...document.querySelectorAll(".project-section h3")].map((heading) => heading.textContent)).toEqual(["Trace", "Burrow", "Loam"]);
  expect(screen.getAllByText("Source code coming soon")).toHaveLength(3);
  const writing = screen.getByRole("region", { name: "Behind the tools." });
  expect(within(writing).getAllByRole("article")).toHaveLength(1);
  expect(within(writing).getByRole("link", { name: new RegExp(FEATURED_POST.title) })).toHaveAttribute("href", postHref(FEATURED_POST));
  expect(within(writing).getByRole("link", { name: "Read all posts" })).toHaveAttribute("href", "/blog");
  expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  expect(screen.queryByText(/Did you know/)).not.toBeInTheDocument();
  expect(screen.getByText(/Redirect checks contact destinations through the server/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /See example/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

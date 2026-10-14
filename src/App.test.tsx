import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("@/components/Worm", () => ({ default: () => null }));
vi.mock("@/components/WormLogo", () => ({ default: () => <Link to="/" aria-label="daggmask.com home">Logo</Link> }));
vi.mock("@/components/ToolDemo", () => ({ default: ({ name }: { name: string }) => <figure aria-label={`${name} example`} /> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("keeps the same header and logo while navigating home, blog, and article", async () => {
  window.history.replaceState({}, "", "/");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<App />);
  const getHeader = () => screen.getByRole("navigation", { name: "Main navigation" }).closest("header");
  const header = getHeader();
  const logo = screen.getByRole("link", { name: "daggmask.com home" });
  fireEvent.click(screen.getByRole("link", { name: "Blog" }));
  await screen.findByRole("heading", { name: "Notes from the build." });
  expect(window.location.pathname).toBe("/blog");
  expect(getHeader()).toBe(header);
  expect(screen.getByRole("link", { name: "daggmask.com home" })).toBe(logo);
  fireEvent.click(screen.getByRole("link", { name: /Why Trace won’t follow every link/ }));
  await screen.findByRole("heading", { level: 1, name: "Why Trace won’t follow every link" });
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://daggmask.com/blog/trace-redirect-safety");
  expect(getHeader()).toBe(header);
  fireEvent.click(screen.getByRole("link", { name: "All posts" }));
  await screen.findByRole("heading", { name: "Notes from the build." });
  fireEvent.click(logo);
  await screen.findByRole("heading", { level: 1, name: "Keep control of what you share." });
  expect(window.location.pathname).toBe("/");
  expect(getHeader()).toBe(header);
  expect(screen.getByRole("link", { name: "daggmask.com home" })).toBe(logo);
});

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Index from "./Index";

vi.mock("@/components/Worm", () => ({ default: () => <div data-testid="hero-worm" /> }));
vi.mock("@/components/WormLogo", () => ({ default: () => <a href="/" aria-label="daggmask.com home">Logo</a> }));
vi.mock("@/components/ToolDemo", () => ({ default: ({ name }: { name: string }) => <figure aria-label={`${name} example`} /> }));
afterEach(cleanup);

it("introduces the tools with dedicated, accessible sections and the existing destinations", () => {
  render(<Index />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Keep control of what you share.");
  const nav = screen.getByRole("navigation", { name: "Main navigation" });
  for (const name of ["Burrow", "Loam", "Trace"]) {
    const id = name.toLowerCase();
    expect(within(nav).getByRole("link", { name })).toHaveAttribute("href", `#${id}`);
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
  expect(screen.getByRole("link", { name: /Why Trace won’t follow every link/ })).toHaveAttribute("href", "/blog/trace-redirect-safety");
  expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  expect(screen.queryByText(/Did you know/)).not.toBeInTheDocument();
  expect(screen.getByText(/Redirect checks contact destinations through the server/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /See example/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

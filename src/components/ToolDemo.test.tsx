import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ToolDemo from "./ToolDemo";

class Observer {
  static instances: Observer[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  constructor(private callback: IntersectionObserverCallback) { Observer.instances.push(this); }
  show(ratio = 0.5) {
    this.callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  Observer.instances = [];
  vi.stubGlobal("IntersectionObserver", Observer);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("Tool demonstrations", () => {
  it("starts at 35% visibility, completes once, and can be replayed", () => {
    const { container } = render(<ToolDemo tool="burrow" name="Burrow" />);
    const observer = Observer.instances[0];
    act(() => observer.show(0.2));
    act(() => vi.advanceTimersByTime(4000));
    expect(container.querySelector("figure")).toHaveAttribute("data-stage", "0");
    act(() => observer.show(0.35));
    expect(observer.disconnect).toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1600));
    expect(container.querySelectorAll(".is-excluded")).toHaveLength(2);
    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByText("2 of 4 events in your filtered calendar")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6000));
    expect(container.querySelector("figure")).toHaveAttribute("data-stage", "3");
    fireEvent.click(screen.getByRole("button", { name: "Replay Burrow example" }));
    expect(container.querySelector("figure")).toHaveAttribute("data-stage", "0");
    act(() => vi.advanceTimersByTime(3000));
    expect(container.querySelector("figure")).toHaveAttribute("data-stage", "3");
  });

  it("shows a static before-and-after for reduced motion and cancels active timers", () => {
    const preference = Object.assign(new EventTarget(), { matches: false });
    vi.spyOn(window, "matchMedia").mockReturnValue(preference as MediaQueryList);
    const { container } = render(<ToolDemo tool="loam" name="Loam" />);
    act(() => Observer.instances[0].show());
    act(() => vi.advanceTimersByTime(600));
    Object.assign(preference, { matches: true });
    act(() => preference.dispatchEvent(new Event("change")));
    expect(container.querySelectorAll(".is-removed")).toHaveLength(3);
    expect(screen.getByText("59.3293° N, 18.0686° E")).toBeInTheDocument();
    expect(screen.getByText("A cleaned copy. The same photo.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves the article ID and anchor while removing sample tracking", () => {
    const { container, unmount } = render(<ToolDemo tool="trace" name="Trace" />);
    act(() => Observer.instances[0].show());
    act(() => vi.advanceTimersByTime(3000));
    expect(container.querySelector(".tracking-text")).toHaveClass("is-removed");
    expect(container.querySelector(".clean-url code")).toHaveTextContent("https://example.com/article?id=42#read");
    fireEvent.click(screen.getByRole("button", { name: "Replay Trace example" }));
    expect(vi.getTimerCount()).toBe(3);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("shows the final example if visibility observers are unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    // The compatibility check tests for a usable observer constructor.
    const { container } = render(<ToolDemo tool="loam" name="Loam" />);
    expect(container.querySelector("figure")).toHaveAttribute("data-stage", "3");
  });
});

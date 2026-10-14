import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Worm from "./Worm";

let visibility: IntersectionObserverCallback;
let resize: ResizeObserverCallback;
let width: number;
const intersectionDisconnect = vi.fn();
const resizeDisconnect = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  width = 600;
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(() => ({ width, height: 400 }) as DOMRect);
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: ResizeObserverCallback) { resize = callback; }
    observe() {}
    disconnect = resizeDisconnect;
  });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { visibility = callback; }
    observe() {}
    disconnect = intersectionDisconnect;
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

const show = (isIntersecting: boolean) => act(() => visibility([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));

it("measures its hero, ignores clicks, pauses offscreen and cleans up", () => {
  const { container, unmount } = render(<Worm />);
  const root = container.firstElementChild!;
  const svg = container.querySelector("svg")!;
  const circle = container.querySelector("g circle")!;
  expect(svg).toHaveAttribute("width", "600");
  expect(root).toHaveClass("pointer-events-none", "absolute");
  expect(root).not.toHaveAttribute("role");
  const initial = circle.getAttribute("cx");
  show(true);
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).not.toBe(initial);
  show(false);
  const paused = circle.getAttribute("cx");
  fireEvent.click(root);
  fireEvent.pointerDown(root);
  act(() => vi.advanceTimersByTime(1000));
  expect(circle.getAttribute("cx")).toBe(paused);
  width = 350;
  act(() => resize([], {} as ResizeObserver));
  expect(svg).toHaveAttribute("width", "350");
  show(true);
  act(() => vi.advanceTimersByTime(100));
  expect(circle.getAttribute("cx")).not.toBe(paused);
  unmount();
  expect(intersectionDisconnect).toHaveBeenCalled();
  expect(resizeDisconnect).toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});

it("stays still when reduced motion is requested and pauses in a hidden tab", () => {
  const preference = Object.assign(new EventTarget(), { matches: true });
  vi.spyOn(window, "matchMedia").mockReturnValue(preference as MediaQueryList);
  const { container } = render(<Worm />);
  const circle = container.querySelector("g circle")!;
  show(true);
  const initial = circle.getAttribute("cx");
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).toBe(initial);
  Object.assign(preference, { matches: false });
  act(() => preference.dispatchEvent(new Event("change")));
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).not.toBe(initial);
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  const paused = circle.getAttribute("cx");
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).toBe(paused);
});

it("can be paused and resumed without restarting its path", () => {
  const { container, getByRole } = render(<Worm />);
  const circle = container.querySelector("g circle")!;
  show(true);
  act(() => vi.advanceTimersByTime(500));
  const beforePause = circle.getAttribute("cx");
  fireEvent.click(getByRole("button", { name: "Pause background animation" }));
  show(true);
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).toBe(beforePause);
  fireEvent.click(getByRole("button", { name: "Resume background animation" }));
  expect(circle.getAttribute("cx")).toBe(beforePause);
  show(true);
  act(() => vi.advanceTimersByTime(500));
  expect(circle.getAttribute("cx")).not.toBe(beforePause);
});

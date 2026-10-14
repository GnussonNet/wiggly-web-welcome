import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WormLogo from "./WormLogo";

const setupMotion = (enabled = true) => {
  const preference = new EventTarget();
  Object.assign(preference, { matches: enabled });
  vi.spyOn(window, "matchMedia").mockReturnValue(preference as MediaQueryList);
  const begin = vi.fn();
  const end = vi.fn();
  Object.defineProperty(SVGElement.prototype, "beginElement", { configurable: true, value: begin });
  Object.defineProperty(SVGElement.prototype, "endElement", { configurable: true, value: end });
  return { preference, begin, end };
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete (SVGElement.prototype as Partial<SVGAnimateElement>).beginElement;
  delete (SVGElement.prototype as Partial<SVGAnimateElement>).endElement;
});

describe("WormLogo", () => {
  it("finishes the current wave on exit and repeats while hovered", () => {
    const { begin, end } = setupMotion();
    const { getByRole, container } = render(<WormLogo />);
    const link = getByRole("link", { name: "daggmask.com home" });
    const animation = container.querySelector("animate")!;
    fireEvent.pointerEnter(link);
    expect(begin).toHaveBeenCalledTimes(5);
    fireEvent.pointerLeave(link);
    expect(end).not.toHaveBeenCalled();
    act(() => animation.dispatchEvent(new Event("endEvent")));
    expect(begin).toHaveBeenCalledTimes(5);
    fireEvent.pointerEnter(link);
    expect(begin).toHaveBeenCalledTimes(10);
    act(() => animation.dispatchEvent(new Event("endEvent")));
    expect(begin).toHaveBeenCalledTimes(15);
  });

  it("honors motion/pointer preferences and stops on preference changes or unmount", () => {
    const { preference, begin, end } = setupMotion(false);
    const { getByRole, unmount } = render(<WormLogo />);
    const link = getByRole("link");
    fireEvent.pointerEnter(link);
    expect(begin).not.toHaveBeenCalled();
    Object.assign(preference, { matches: true });
    fireEvent.pointerEnter(link);
    expect(begin).toHaveBeenCalledTimes(5);
    Object.assign(preference, { matches: false });
    act(() => preference.dispatchEvent(new Event("change")));
    expect(end).toHaveBeenCalledTimes(5);
    Object.assign(preference, { matches: true });
    fireEvent.pointerEnter(link);
    unmount();
    expect(end).toHaveBeenCalledTimes(10);
  });

  it("morphs both source poses without collapsing the body or separating the eyes", () => {
    setupMotion();
    const { container } = render(<WormLogo />);
    const paths = [...container.querySelectorAll("path")];
    expect(paths).toHaveLength(5);
    paths.forEach((path) => {
      const animation = path.querySelector("animate")!;
      const poses = animation.getAttribute("values")!.split(";");
      expect(poses).toHaveLength(3);
      expect(poses[0]).toBe(path.getAttribute("d"));
      expect(poses[2]).toBe(poses[0]);
      expect(poses[1]).not.toBe(poses[0]);
      expect(poses[0].replace(/[^A-Za-z]/g, "")).toBe(poses[1].replace(/[^A-Za-z]/g, ""));
    });
    const bodyPoses = paths[0].querySelector("animate")!.getAttribute("values")!.split(";");
    const numbers = (path: string) => path.match(/-?\d*\.?\d+/g)!.map(Number);
    const rest = numbers(bodyPoses[0]), flipped = numbers(bodyPoses[1]);
    const midway = rest.map((value, index) => (value + flipped[index]) / 2);
    const area = (coordinates: number[]) => {
      let result = 0;
      for (let i = 0; i < coordinates.length; i += 2) {
        const next = (i + 2) % coordinates.length;
        result += coordinates[i] * coordinates[next + 1] - coordinates[next] * coordinates[i + 1];
      }
      return Math.abs(result / 2);
    };
    expect(area(midway)).toBeGreaterThan(area(rest) * 0.65);
    // Each eye moves down with the flipped head; no pointer tracking is attached.
    for (const eye of paths.slice(1, 3)) {
      const poses = eye.querySelector("animate")!.getAttribute("values")!.split(";");
      expect(numbers(poses[1])[1] - numbers(poses[0])[1]).toBeGreaterThan(130);
    }
  });
});

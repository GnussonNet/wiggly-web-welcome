import { useEffect, useRef, useState } from "react";

export function useToolDemo() {
  const ref = useRef<HTMLElement>(null);
  const hasPlayed = useRef(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [stage, setStage] = useState(0);
  const [play, setPlay] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(preference.matches);
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (reduced || hasPlayed.current || !ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setStage(3);
      hasPlayed.current = true;
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!hasPlayed.current && entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35)) {
        hasPlayed.current = true;
        setPlay((value) => value + 1);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!play || reduced) return;
    setStage(0);
    const timers = [600, 1600, 3000].map((delay, index) => window.setTimeout(() => setStage(index + 1), delay));
    return () => timers.forEach(window.clearTimeout);
  }, [play, reduced]);

  return {
    ref,
    stage: reduced ? 3 : stage,
    reduced,
    replay: () => {
      hasPlayed.current = true;
      setPlay((value) => value + 1);
    },
  };
}

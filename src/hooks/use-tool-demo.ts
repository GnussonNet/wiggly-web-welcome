import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (change: () => void) => {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", change);
  return () => preference.removeEventListener("change", change);
};
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

export function useToolDemo() {
  const ref = useRef<HTMLElement>(null);
  const hasPlayed = useRef(false);
  // Prerender the completed example so it is readable without JavaScript.
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerMotion);
  const [stage, setStage] = useState(0);
  const [play, setPlay] = useState(0);

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

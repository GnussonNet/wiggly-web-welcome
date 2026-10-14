import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Keep native-link scroll behavior when the router changes only the page content.
export default function RouteScroll() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const previousPath = useRef(location.pathname);
  const initial = useRef(true);

  useBrowserLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useBrowserLayoutEffect(() => {
    let anchor = location.hash.slice(1);
    try { anchor = decodeURIComponent(anchor); } catch { /* Keep malformed fragments literal. */ }
    const target = anchor ? document.getElementById(anchor) : null;
    const saved = navigationType === "POP" ? positions.current.get(location.key) : undefined;
    const changedPage = previousPath.current !== location.pathname;
    if (saved) {
      window.scrollTo(saved.x, saved.y);
    } else if (target) {
      target.scrollIntoView();
    } else if (!initial.current) {
      window.scrollTo(0, 0);
    }
    if (!initial.current && navigationType !== "POP") {
      const focusTarget = target ?? (changedPage ? document.getElementById("main-content") : null);
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }
    }
    previousPath.current = location.pathname;
    initial.current = false;
    return () => { positions.current.set(location.key, { x: window.scrollX, y: window.scrollY }); };
  }, [location.key, location.pathname, location.hash, navigationType]);

  return null;
}

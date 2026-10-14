import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { WORM_POSES } from "./worm-logo-poses";

const WormLogo = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const wriggleRef = useRef<SVGAnimateElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const wriggle = wriggleRef.current;
    if (!link || !wriggle) return;
    const animations = link.querySelectorAll<SVGAnimationElement>("animate");
    const motion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let hovering = false;
    let running = false;
    const start = () => {
      if (!motion.matches) return;
      hovering = true;
      if (running) return;
      running = true;
      animations.forEach((animation) => animation.beginElement());
    };
    const stop = () => { hovering = false; };
    const finish = () => {
      running = false;
      // Complete the wave back to the original silhouette before stopping.
      if (hovering && motion.matches) start();
    };
    const updatePreference = () => {
      if (motion.matches) return;
      hovering = false;
      running = false;
      animations.forEach((animation) => animation.endElement());
    };
    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    window.addEventListener("blur", stop);
    wriggle.addEventListener("endEvent", finish);
    motion.addEventListener("change", updatePreference);
    return () => {
      link.removeEventListener("pointerenter", start);
      link.removeEventListener("pointerleave", stop);
      window.removeEventListener("blur", stop);
      wriggle.removeEventListener("endEvent", finish);
      motion.removeEventListener("change", updatePreference);
      if (running) animations.forEach((animation) => animation.endElement());
    };
  }, []);

  return (
    <Link ref={linkRef} to="/" aria-label="daggmask.com home" className="worm-logo pointer-events-auto text-foreground">
      <svg viewBox="-16 -16 725 292" fill="none" aria-hidden="true" className="block h-auto w-full">
        {WORM_POSES.map((pose, index) => (
          <path key={index} fill={pose.fill === "white" ? "var(--logo-eye, white)" : pose.fill} d={pose.rest}>
            <animate
              ref={index === 0 ? wriggleRef : undefined}
              attributeName="d"
              values={`${pose.rest};${pose.flipped};${pose.rest}`}
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.77 0 0.175 1;0.77 0 0.175 1"
              dur="1.8s"
              begin="indefinite"
              fill="remove"
            />
          </path>
        ))}
      </svg>
    </Link>
  );
};

export default WormLogo;

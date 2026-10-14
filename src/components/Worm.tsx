import { useEffect, useRef, useState } from "react";

// An animated earthworm that crawls along a meandering path across the page.
const SEGMENTS = 18;

type Point = { x: number; y: number };

const Worm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      setSize({ w: width, h: height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let elapsed = 0;
    let lastTime: number | null = null;
    const loop = (now: number) => {
      if (lastTime !== null) elapsed += (now - lastTime) / 1000;
      lastTime = now;
      setTick(elapsed);
      frame = requestAnimationFrame(loop);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      lastTime = null;
      if (visible && !document.hidden && !preference.matches) {
        frame = requestAnimationFrame(loop);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(container);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
    };
  }, []);

  // Parametric meandering path across the viewport (figure-8-ish lissajous)
  const pathAt = (t: number): Point => {
    const w = size.w;
    const h = size.h;
    const cx = w / 2;
    const cy = h / 2;
    const ax = w * 0.38;
    const ay = h * 0.32;
    const x = cx + Math.sin(t * 0.6) * ax + Math.cos(t * 0.23) * 40;
    const y = cy + Math.sin(t * 0.9) * ay * 0.8 + Math.cos(t * 0.5) * 30;
    return { x, y };
  };

  // Build segments by sampling the path slightly behind in time.
  const head = pathAt(tick);
  const segments: Point[] = [];
  const dt = 0.06;
  for (let i = 0; i < SEGMENTS; i++) {
    segments.push(pathAt(tick - i * dt));
  }

  // body width tapers head-to-tail with a slight bulge mid-body
  const widthAt = (i: number) => {
    const n = SEGMENTS - 1;
    const u = i / n; // 0 head .. 1 tail
    const bulge = Math.sin(u * Math.PI) * 6;
    return 22 - u * 10 + bulge;
  };

  // Subtle breathing along the body.
  const squish = (i: number) => 1 + Math.sin(tick * 6 - i * 0.6) * 0.08;

  // direction at head for eyes
  const ahead = pathAt(tick + 0.05);
  const angle = Math.atan2(ahead.y - head.y, ahead.x - head.x);

  return (
    <div ref={containerRef} className="ambient-worm pointer-events-none absolute inset-0" aria-hidden="true">
      <svg width={size.w} height={size.h} className="absolute inset-0">
        <defs>
          <radialGradient id="wormGrad" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="hsl(var(--worm-body))" />
            <stop offset="100%" stopColor="hsl(var(--worm-shadow))" />
          </radialGradient>
          <filter id="wormShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g filter="url(#wormShadow)">
          {/* tail to head so head renders on top */}
          {segments
            .map((p, i) => ({ p, i }))
            .reverse()
            .map(({ p, i }) => {
              const r = (widthAt(i) / 2) * squish(i);
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill="url(#wormGrad)"
                />
              );
            })}

          {/* segmentation rings */}
          {segments.slice(1, -1).map((p, idx) => {
            const i = idx + 1;
            const r = (widthAt(i) / 2) * squish(i) * 0.85;
            return (
              <circle
                key={`ring-${i}`}
                cx={p.x}
                cy={p.y}
                r={r}
                fill="none"
                stroke="hsl(var(--worm-shadow) / 0.35)"
                strokeWidth={1}
              />
            );
          })}

          {/* clitellum (the band) — subtle */}
          {(() => {
            const p = segments[5];
            const r = (widthAt(5) / 2) * squish(5) + 0.5;
            return (
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill="hsl(0 0% 100%)"
                opacity={0.12}
              />
            );
          })()}

          {/* eyes */}
          {(() => {
            const eyeOffset = 4;
            const nx = Math.cos(angle + Math.PI / 2);
            const ny = Math.sin(angle + Math.PI / 2);
            return (
              <g>
                <circle cx={head.x + nx * eyeOffset} cy={head.y + ny * eyeOffset} r={1.8} fill="hsl(0 0% 100%)" />
                <circle cx={head.x - nx * eyeOffset} cy={head.y - ny * eyeOffset} r={1.8} fill="hsl(0 0% 100%)" />
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default Worm;

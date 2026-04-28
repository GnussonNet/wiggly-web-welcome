import { useEffect, useRef, useState } from "react";

// An animated earthworm that crawls along a meandering path across the page.
const SEGMENTS = 18;
const SQUEEZE_DURATION = 600; // ms to squeeze in
const HOLD_DURATION = 250; // ms held compressed
const RELEASE_DURATION = 500; // ms to expand back

type Point = { x: number; y: number };

const Worm = () => {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200, h: typeof window !== "undefined" ? window.innerHeight : 800 });
  const [tick, setTick] = useState(0);
  const [squeeze, setSqueeze] = useState(0); // 0 = normal, 1 = fully squeezed
  const rafRef = useRef<number>();
  const startRef = useRef<number>(performance.now());
  const pausedTimeRef = useRef<number>(0); // frozen tick value while squeezing
  const squeezeStartRef = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loop = () => {
      const now = performance.now();

      if (squeezeStartRef.current !== null) {
        const elapsed = now - squeezeStartRef.current;
        const total = SQUEEZE_DURATION + HOLD_DURATION + RELEASE_DURATION;
        if (elapsed < SQUEEZE_DURATION) {
          setSqueeze(elapsed / SQUEEZE_DURATION);
        } else if (elapsed < SQUEEZE_DURATION + HOLD_DURATION) {
          setSqueeze(1);
        } else if (elapsed < total) {
          const r = (elapsed - SQUEEZE_DURATION - HOLD_DURATION) / RELEASE_DURATION;
          setSqueeze(1 - r);
        } else {
          setSqueeze(0);
          squeezeStartRef.current = null;
          // resume time so the worm continues smoothly from where it paused
          startRef.current = now - pausedTimeRef.current * 1000;
        }
        // keep tick frozen at the moment of click
        setTick(pausedTimeRef.current);
      } else {
        setTick((now - startRef.current) / 1000);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
  // When squeezed, segments collapse toward the head.
  const head = pathAt(tick);
  const segments: Point[] = [];
  const dt = 0.06;
  for (let i = 0; i < SEGMENTS; i++) {
    const p = pathAt(tick - i * dt);
    // ease toward head as squeeze increases
    const k = squeeze; // 0..1
    segments.push({
      x: p.x + (head.x - p.x) * k,
      y: p.y + (head.y - p.y) * k,
    });
  }

  // body width tapers head-to-tail with a slight bulge mid-body
  const widthAt = (i: number) => {
    const n = SEGMENTS - 1;
    const u = i / n; // 0 head .. 1 tail
    const bulge = Math.sin(u * Math.PI) * 6;
    return 22 - u * 10 + bulge;
  };

  // breathing / squish along the body — amplified while squeezing
  const squish = (i: number) => {
    const base = 1 + Math.sin(tick * 6 - i * 0.6) * 0.08;
    return base + squeeze * 0.35; // fatten up when collapsed
  };

  // direction at head for eyes
  const ahead = pathAt(tick + 0.05);
  const angle = Math.atan2(ahead.y - head.y, ahead.x - head.x);

  const handlePress = () => {
    if (squeezeStartRef.current !== null) return; // already squeezing
    pausedTimeRef.current = tick;
    squeezeStartRef.current = performance.now();
  };

  return (
    <div
      className="fixed inset-0 z-10 cursor-pointer"
      aria-hidden="true"
      onPointerDown={handlePress}
    >
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

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const SEGMENTS = 18;
type Size = { w: number; h: number };
type Point = { x: number; y: number };

const pathAt = (t: number, size: Size): Point => ({
  x: size.w / 2 + Math.sin(t * 0.6) * size.w * 0.38 + Math.cos(t * 0.23) * 40,
  y: size.h / 2 + Math.sin(t * 0.9) * size.h * 0.32 * 0.8 + Math.cos(t * 0.5) * 30,
});
const widthAt = (i: number) => {
  const u = i / (SEGMENTS - 1);
  return 22 - u * 10 + Math.sin(u * Math.PI) * 6;
};
const radiusAt = (i: number, tick: number) => widthAt(i) / 2 * (1 + Math.sin(tick * 6 - i * 0.6) * 0.08);
const placeCircle = (circle: SVGCircleElement | null, point: Point, radius?: number) => {
  if (!circle) return;
  circle.setAttribute("cx", point.x.toFixed(3));
  circle.setAttribute("cy", point.y.toFixed(3));
  if (radius !== undefined) circle.setAttribute("r", radius.toFixed(3));
};

const Worm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<(SVGCircleElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bandRef = useRef<SVGCircleElement>(null);
  const eyeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const tickRef = useRef(0);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [paused, setPaused] = useState(false);

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
    let lastTime: number | null = null;
    const paint = () => {
      const tick = tickRef.current;
      for (let i = 0; i < SEGMENTS; i++) {
        const point = pathAt(tick - i * 0.06, size);
        placeCircle(bodyRefs.current[i], point, radiusAt(i, tick));
        if (i > 0 && i < SEGMENTS - 1) placeCircle(ringRefs.current[i], point, radiusAt(i, tick) * 0.85);
        if (i === 5) placeCircle(bandRef.current, point, radiusAt(i, tick) + 0.5);
      }
      const head = pathAt(tick, size), ahead = pathAt(tick + 0.05, size);
      const angle = Math.atan2(ahead.y - head.y, ahead.x - head.x) + Math.PI / 2;
      eyeRefs.current.forEach((eye, i) => {
        const offset = i ? -4 : 4;
        placeCircle(eye, { x: head.x + Math.cos(angle) * offset, y: head.y + Math.sin(angle) * offset });
      });
    };
    const loop = (now: number) => {
      if (lastTime !== null) tickRef.current += (now - lastTime) / 1000;
      lastTime = now;
      // Decorative frame updates touch SVG elements directly, not React state.
      paint();
      frame = requestAnimationFrame(loop);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      lastTime = null;
      if (visible && !document.hidden && !preference.matches && !paused) frame = requestAnimationFrame(loop);
    };
    paint();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(container);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
    };
  }, [size, paused]);

  const tick = tickRef.current;
  const segments = Array.from({ length: SEGMENTS }, (_, i) => ({ point: pathAt(tick - i * 0.06, size), i }));
  const head = pathAt(tick, size), ahead = pathAt(tick + 0.05, size);
  const angle = Math.atan2(ahead.y - head.y, ahead.x - head.x) + Math.PI / 2;
  return <><div ref={containerRef} className="ambient-worm pointer-events-none absolute inset-0" aria-hidden="true">
    <svg width={size.w} height={size.h} className="absolute inset-0">
      <defs>
        <radialGradient id="wormGrad" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="hsl(var(--worm-body))" /><stop offset="100%" stopColor="hsl(var(--worm-shadow))" /></radialGradient>
        <filter id="wormShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" /><feOffset dx="0" dy="4" result="off" />
          <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#wormShadow)">
        {[...segments].reverse().map(({ point, i }) => <circle key={i} ref={node => { bodyRefs.current[i] = node; }} cx={point.x} cy={point.y} r={radiusAt(i, tick)} fill="url(#wormGrad)" />)}
        {segments.slice(1, -1).map(({ point, i }) => <circle key={`ring-${i}`} ref={node => { ringRefs.current[i] = node; }} cx={point.x} cy={point.y} r={radiusAt(i, tick) * 0.85} fill="none" stroke="hsl(var(--worm-shadow) / 0.35)" strokeWidth={1} />)}
        <circle ref={bandRef} cx={segments[5].point.x} cy={segments[5].point.y} r={radiusAt(5, tick) + 0.5} fill="hsl(0 0% 100%)" opacity={0.12} />
        {[4, -4].map((offset, i) => <circle key={i} ref={node => { eyeRefs.current[i] = node; }} cx={head.x + Math.cos(angle) * offset} cy={head.y + Math.sin(angle) * offset} r={1.8} fill="hsl(0 0% 100%)" />)}
      </g>
    </svg>
  </div>
    {size.w > 0 && <button type="button" className="worm-motion-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume background animation" : "Pause background animation"} title={paused ? "Resume background animation" : "Pause background animation"}>
      {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
    </button>}
  </>;
};
export default Worm;

import restSvg from "@/assets/worm/rest.svg?raw";
import flippedSvg from "@/assets/worm/flipped.svg?raw";

type Point = { x: number; y: number };

const extractPaths = (svg: string) => [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((match) => match[1]);

// Flatten the source Beziers, then match the two contours anatomically:
// tail -> upper outline -> head -> lower outline -> tail. A reflected path's
// original point ordering would interpolate the upper edge into the lower edge.
const outline = (path: string): Point[] => {
  const points: Point[] = [];
  let current = { x: 0, y: 0 };
  for (const match of path.matchAll(/([MCLZ])([^MCLZ]*)/g)) {
    const v = (match[2].match(/-?\d*\.?\d+/g) ?? []).map(Number);
    if (match[1] === "M" || match[1] === "L") {
      current = { x: v[0], y: v[1] };
      points.push(current);
    } else if (match[1] === "C") {
      for (let step = 1; step <= 20; step++) {
        const t = step / 20, u = 1 - t;
        points.push({
          x: u ** 3 * current.x + 3 * u ** 2 * t * v[0] + 3 * u * t ** 2 * v[2] + t ** 3 * v[4],
          y: u ** 3 * current.y + 3 * u ** 2 * t * v[1] + 3 * u * t ** 2 * v[3] + t ** 3 * v[5],
        });
      }
      current = { x: v[4], y: v[5] };
    }
  }
  return points;
};

const sample = (points: Point[], count: number): Point[] => {
  const distances = [0];
  for (let i = 1; i < points.length; i++) {
    distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  let segment = 1;
  return Array.from({ length: count }, (_, i) => {
    const distance = distances.at(-1)! * i / count;
    while (segment < distances.length - 1 && distances[segment] < distance) segment++;
    const start = points[segment - 1], end = points[segment];
    const fraction = (distance - distances[segment - 1]) / (distances[segment] - distances[segment - 1] || 1);
    return { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction };
  });
};

const normalizeBody = (path: string): string => {
  const points = outline(path);
  let tail = 0, head = 0;
  points.forEach((p, i) => {
    if (p.x < points[tail].x) tail = i;
    if (p.x > points[head].x) head = i;
  });
  const arc = (from: number, to: number, direction: number) => {
    const result = [points[from]];
    for (let i = (from + direction + points.length) % points.length; i !== to; i = (i + direction + points.length) % points.length) {
      result.push(points[i]);
    }
    result.push(points[to]);
    return result;
  };
  const forward = arc(tail, head, 1), backward = arc(tail, head, -1);
  const meanY = (arc: Point[]) => arc.reduce((sum, p) => sum + p.y, 0) / arc.length;
  const [upper, lower] = meanY(forward) < meanY(backward) ? [forward, backward] : [backward, forward];
  const matched = [...sample(upper, 128), ...sample([...lower].reverse(), 128)];
  return matched.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join("") + "Z";
};

const rest = extractPaths(restSvg);
const flipped = extractPaths(flippedSvg);

export const WORM_POSES = rest.map((path, i) => {
  const restPath = i === 0 ? normalizeBody(path) : path;
  const flippedPath = i === 0 ? normalizeBody(flipped[i]) : flipped[i];
  const targetCoordinates = flippedPath.match(/-?\d*\.?\d+/g)!.map(Number);
  let coordinate = 0;
  // Half the original wave, using the same interpolation for the body and eyes.
  const halfway = restPath.replace(/-?\d*\.?\d+/g, (value) =>
    ((Number(value) + targetCoordinates[coordinate++]) / 2).toFixed(3));
  return {
    rest: restPath,
    flipped: flippedPath,
    halfway,
    fill: i === 1 || i === 2 ? "white" : "currentColor",
  };
});

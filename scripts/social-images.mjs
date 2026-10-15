import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import path from 'node:path';

// Use the site's bundled fonts, never fonts installed on the build machine.
export async function createSocialImage(page, root, width, height) {
  for (const [file, family] of [
    ['inter-latin-variable.woff2', 'Share Inter'],
    ['jetbrains-mono-latin-variable.woff2', 'Share Mono'],
  ]) {
    if (!GlobalFonts.registerFromPath(path.join(root, 'public/fonts', file), family)) {
      throw new Error(`Could not load social image font: ${file}`);
    }
  }
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5f5f7';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#1d1d1f';
  ctx.font = '500 32px "Share Inter"';
  ctx.fillText('daggmask', 64, 88);
  const logo = await loadImage(path.join(root, 'public/web-app-manifest-192x192.png'));
  ctx.drawImage(logo, width - 140, 40, 76, 76);
  ctx.fillStyle = '#626268';
  ctx.font = '18px "Share Mono"';
  ctx.fillText(page.imageLabel ?? 'Notes from the build', 64, 160);

  const title = page.imageTitle ?? page.title;
  const maxWidth = width - 128;
  let lines;
  let size = 68;
  // Measure actual glyphs and reduce the type size for unusually long titles.
  for (; size >= 32; size -= 2) {
    ctx.font = `600 ${size}px "Share Inter"`;
    lines = [];
    for (const paragraph of title.split('\n')) {
      let line = '';
      for (const word of paragraph.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(candidate).width > maxWidth) {
          lines.push(line);
          line = word;
        } else line = candidate;
      }
      if (line) lines.push(line);
    }
    if (lines.length * size * 1.16 <= 280 && lines.every(line => ctx.measureText(line).width <= maxWidth)) break;
  }
  if (size < 32) throw new Error(`Social image title does not fit: ${title}`);
  ctx.fillStyle = '#1d1d1f';
  lines.forEach((line, index) => ctx.fillText(line, 64, 256 + index * size * 1.16));
  ctx.strokeStyle = '#d8d8dc';
  ctx.beginPath();
  ctx.moveTo(64, 530);
  ctx.lineTo(width - 64, 530);
  ctx.stroke();
  ctx.fillStyle = '#626268';
  ctx.font = '18px "Share Mono"';
  ctx.fillText('daggmask.com', 64, 576);
  ctx.textAlign = 'right';
  ctx.fillText(page.article ? 'Notes from the build' : 'Quiet, useful tools.', width - 64, 576);
  return canvas.encode('png');
}

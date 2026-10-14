import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { staticPages, renderPage } from '../.prerender/prerender.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const origin = 'https://daggmask.com';
for (const page of staticPages) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  const values = {
    description: page.description,
    'og:title': page.title,
    'og:description': page.description,
    'og:url': origin + page.path,
    'og:type': page.article ? 'article' : 'website',
    'twitter:title': page.title,
    'twitter:description': page.description,
  };
  for (const [key, value] of Object.entries(values)) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    html = html.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*/?>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${origin + page.path}" />`);
  const content = renderPage(page.path);
  html = html.replace('<div id="root"></div>', () => `<div id="root">${content}</div>`);
  const directory = path.join(root, 'dist', page.path);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
const locations = [...new Set(staticPages.map(page => page.path))];
await writeFile(path.join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations.map(location => `  <url><loc>${origin}${location}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generated ${staticPages.length} pages and sitemap.xml.`);

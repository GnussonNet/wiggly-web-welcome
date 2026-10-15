import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { loadImage } from '@napi-rs/canvas';
import { staticPages, SITE_ORIGIN, DEFAULT_SHARE_IMAGE, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT } from '../.prerender/prerender.js';

// Run after npm run build: validate the exact files served to crawlers without JS.
for (const page of staticPages) {
  test(`crawler metadata and image for ${page.path}`, async () => {
    const html = await readFile(`dist${page.path === '/' ? '' : page.path}/index.html`, 'utf8');
    const document = new JSDOM(html).window.document;
    const expectedImage = page.image ?? DEFAULT_SHARE_IMAGE;
    for (const [attribute, key, value] of [
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:image', SITE_ORIGIN + expectedImage],
      ['property', 'og:image', SITE_ORIGIN + expectedImage],
      ['property', 'og:image:alt', page.imageAlt ?? page.title],
      ['property', 'og:image:type', 'image/png'],
      ['property', 'og:image:width', String(SHARE_IMAGE_WIDTH)],
      ['property', 'og:image:height', String(SHARE_IMAGE_HEIGHT)],
    ]) {
      const tags = document.querySelectorAll(`meta[${attribute}="${key}"]`);
      assert.equal(tags.length, 1, `${key} must appear exactly once`);
      assert.equal(tags[0].content, value);
    }
    const buffer = await readFile(`dist${expectedImage}`);
    assert.ok(buffer.length < 5 * 1024 * 1024);
    const image = await loadImage(buffer);
    assert.equal(image.width, SHARE_IMAGE_WIDTH);
    assert.equal(image.height, SHARE_IMAGE_HEIGHT);
  });
}

test('every post has a distinct generated image', async () => {
  const posts = staticPages.filter(page => page.article);
  const images = await Promise.all(posts.map(async page => (await readFile(`dist${page.image}`)).toString('base64')));
  assert.equal(new Set(images).size, posts.length);
});

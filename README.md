# Daggmask

[daggmask.com](https://daggmask.com) is a collection of quiet, useful tools that dig through complexity and give people more control. The visual identity is minimal and monochrome, with an earthworm adding a little personality. Privacy and security should be reflected in how the tools work.

## Published projects

- **[Burrow](https://burrow.daggmask.com)** — Filter an .ics calendar feed using your own rules and subscribe to only the events you need.

## Project ideas

These names are working names, not checked for availability.

| Project | Purpose | Fit with Daggmask |
| --- | --- | --- |
| **Loam** | Inspect and remove metadata from images locally in the browser. | A focused privacy tool with an earthy name. Next project. |
| **Sift** | Combine RSS feeds, filter by keywords, remove duplicates, and subscribe to the result. | Burrow's natural sibling: your sources, less noise. |
| **Trace** | Inspect redirect destinations and URL parameters; remove known tracking parameters. | Everyday usefulness connected to cybersecurity. |
| **Strata** | Explain DNS records, certificate details, and HTTP security headers. | Makes digging through the layers literal. |
| **Molt** | Permanently redact selected text from PDFs and export a cleaned copy. | A focused privacy utility; reliable redaction needs careful validation. |
| **Cast** | Turn a calendar into a shareable busy/free feed without event titles, locations, or descriptions. | A privacy-focused companion to Burrow. |

Collection principles: one clear job, a useful result before account creation, and a plain explanation of where the user's data goes. Use natural names without forcing every project into a worm pun.

## Loam — project prompt

Copy the following brief into a new project:

```text
Build Loam, a working browser-based image metadata inspector and cleaner by Daggmask. Intended address: loam.daggmask.com.

Product promise: See what your photos share. Choose what leaves with them.

Loam must feel like a sibling of https://daggmask.com and https://burrow.daggmask.com. Inspect those references if available. If working in the same local environment, use /home/filip/Work/daggmask.com/src/index.css and /home/filip/Work/calendar-filter/app/globals.css as read-only design references. The specifications below also make this brief self-contained.

VISUAL IDENTITY

- Light monochrome palette: canvas and surfaces #fafafa, subtle panels #f0f0f0, primary text and buttons #141414, secondary text #686868, borders #dedede. Reserve restrained warning/error colors for actual status messages.
- Inter for interface text and headings. JetBrains Mono for metadata keys, file details, small labels, and footer details. Bundle fonts locally.
- Lowercase “loam” wordmark, about 25px, medium weight, tight tracking. Small “by daggmask” link to the parent site.
- Generous whitespace; thin borders; mostly flat surfaces; compact 4–8px corner radii. Black primary buttons with off-white text. Quiet outlined secondary buttons. Simple consistent line icons.
- Desktop content width around 1240px with 32px side padding; 20px padding on mobile. Large, medium-weight hero type, roughly 44–64px desktop and 34–43px mobile. Use a two-line headline with the second line in muted gray, as in Burrow.
- Follow Burrow's useful product structure: understated header, split hero with the real tool, a short three-step explanation, compact questions, and a quiet footer. On mobile, use one column.
- Keep the voice calm, direct, and practical. An earthy name and a small parent-brand detail are enough personality. Avoid gradients, glass effects, oversized shadows, stock imagery, decorative dashboards, and invented social proof.

PAGE AND FLOW

Header: loam wordmark; “How it works” and “Questions” anchor links; “Choose a photo” action.

Hero kicker: “A little less attached.”
Hero headline: “Keep the photo.” / “Leave the metadata.”
Description: “See the hidden details in your images. Remove metadata before you share, right in your browser.”
Privacy line: “Your photos stay in this browser. No upload. No account.” This statement must be true of the implementation.

Place the working file picker/drop zone beside the hero copy. Explain accepted formats and limits before selection. Offer a clearly labeled sample so users can explore without selecting a personal file. The sample must use a real bundled fixture and the same processing path as user files.

After selection, show an image preview, filename, format, dimensions, size, and grouped metadata. Useful groups include location, device, dates, author/software, and other metadata. Distinguish an absent field from an unsupported or unreadable field. Treat metadata values as untrusted text.

Do not automatically display a map or contact a location service. If GPS data exists, show it as text. Explain technical fields in plain language without claiming that metadata alone identifies a person.

Primary action: “Remove metadata”. Then show the cleaned preview, output size, and a before/after metadata comparison based on re-inspecting the actual output. Offer “Download cleaned photo” and “Choose another photo”. Preserve the original file and use a clearly suffixed download filename.

Handle no metadata found, unsupported files, corrupt files, oversized images, processing, success, and failures. Never imply successful cleaning after a processing failure. Do not use simulated progress or fabricated results.

Below the tool, explain three steps: Choose a photo → Inspect its details → Download a cleaned copy. Include short questions covering local processing, supported formats, image quality, and the limits of metadata removal. Explain that visible content, filenames, and information added later by sharing platforms are separate from embedded metadata.

IMPLEMENTATION AND SCOPE

- Build a real MVP with React, TypeScript, and an appropriate lightweight build setup. Reuse existing project conventions when present.
- Support one JPEG or PNG at a time initially. Clearly reject unsupported formats such as HEIC, SVG, and animated files. Do not claim broader support than implemented.
- All inspection, cleaning, and download generation must happen locally. No file uploads, remote processing, analytics, third-party scripts, external image requests, or backend dependency. Keep file contents and metadata out of logs and persistent browser storage.
- Use maintained format-aware libraries where useful. Prefer removing metadata from the original encoded file without recompressing image pixels. Remove embedded EXIF, GPS, IPTC, XMP, textual comments, and embedded thumbnails where supported.
- Explicitly handle orientation and color profiles. Preserve correct visual orientation and color appearance; distinguish rendering information intentionally retained from descriptive metadata removed. Do not advertise “all metadata removed” if rendering metadata remains. If re-encoding is necessary, disclose the format and possible quality change before processing.
- Re-inspect the generated bytes before reporting what was removed or retained. Do not infer success from an empty UI state.
- Start with a 20 MB file limit and explicit image dimension/pixel limits appropriate to the implementation. Validate contents as well as extensions, keep the interface responsive, release object URLs, and discard in-memory file references on reset.
- Make the picker keyboard accessible, provide visible focus states and labeled controls, announce processing/results, respect reduced motion, and support small screens without horizontal overflow. Drag-and-drop must be optional.
- Verify with fixtures containing GPS, EXIF orientation, embedded thumbnails, PNG text, XMP/IPTC, and color profiles, plus clean, corrupt, and unsupported files. Confirm actual output metadata and visual orientation/color; check that processing causes no outbound file or metadata requests.
- Document supported metadata, retained rendering information, limitations, and local development commands in the project README.

Deliver the working tool and its matching landing page, not only a visual mockup. Keep the first release focused on inspecting, cleaning, and downloading one image. Batch processing and additional formats can follow later.
```

## License

The Daggmask website, its original branding, and its written content are not
open source. See the [copyright notice](LICENSE). The package is marked
`UNLICENSED`; third-party dependencies, fonts, and bundled assets retain their
own licenses and notices.

The separately maintained Trace, Burrow, and Loam tools are licensed under MIT.
Their licenses do not apply to this website.

## Writing a case study

Blog posts live in `src/content/blog/`. Add a Markdown file with a lowercase,
hyphenated filename; the filename becomes its `/blog/<filename>` URL. For example:

```markdown
---
title: "A decision worth explaining"
description: "A short summary for the blog listing and social previews."
date: "2026-10-14"
project: "trace"
---

Start with the problem, then explain the decisions, tradeoffs, evidence, and limits.

## What could go wrong

Write the article here. Standard Markdown headings, links, lists, and fenced code
blocks are supported. Raw HTML is not rendered.
```

Use `trace`, `burrow`, or `loam` for `project`. Posts are grouped by project and sorted
newest first. The homepage features the newest published post. There is no CMS,
upload service, or external content request: writing is versioned with the site.
Adding a file makes it part of the next build; keep unfinished drafts outside this
folder. Invalid metadata fails the build rather than publishing a partial post.

`npm run build` generates the SPA assets, complete HTML for `/`, `/blog`, and every
post, and `dist/sitemap.xml`. Serve the generated `dist/` directory, resolving directory
URLs to their `index.html` and falling back to the root `index.html` for SPA routes.
Text, titles, descriptions, and canonical URLs are present before JavaScript runs.
The build also generates a branded 1200 × 630 PNG for each post in
`dist/social/blog/`, using its title and project, plus cards for the homepage and
blog listing. Open Graph and Twitter image tags and `summary_large_image` are
included in each page's initial HTML and updated during browser navigation.
New posts get their images automatically at build time; no image service or
manual artwork is required. Deploy the complete `dist/` directory, including
`social/`, so crawlers can fetch both the article HTML and its image.
Run `npm run test:social` to build and validate the crawler metadata, image
dimensions, and distinct post images.

The production server must resolve `/blog/<slug>` to
`/blog/<slug>/index.html` before applying its SPA fallback. A browser can hide
incorrect server routing because React replaces the metadata after loading;
social crawlers read the initial HTML. If the explicit `index.html` URL has the
right title but the clean URL has the homepage title, fix the server routing.
For Coolify's default Nixpacks deployment, `nixpacks.toml` overrides the generated
Caddyfile with this routing behavior. Leave the install, build, and start command
fields at their defaults and redeploy after committing the configuration.
Nixpacks still runs the existing build script and starts its Caddy server on
`PORT` (3000 by default); HTTPS remains handled by Coolify's proxy.
For a Caddy file server, keep the existing site root and replace its SPA
`try_files` rule with:

```caddyfile
try_files {path}/index.html {path} /index.html
file_server
```

This rule checks generated page HTML first, then static assets, then the SPA
fallback. Apply it to the Caddy server serving `dist/`, rather than an unrelated
reverse proxy. See [Caddy's try_files documentation](https://caddyserver.com/docs/caddyfile/directives/try_files).
After building locally, check the actual deployment with:

```bash
SOCIAL_TEST_ORIGIN=https://daggmask.com node --test scripts/social-share.test.mjs
```

This requests the clean article URLs without running JavaScript, catching
homepage fallbacks that local file checks cannot detect.
Matching pages are hydrated in place, preserving the initial HTML. The root's
`data-prerendered-path` identifies which page was generated, so development and
unknown-path fallbacks use a fresh client render instead of hydrating the wrong page.

`SiteRoutes` and `SiteLayout` share the same route structure in the browser and the
prerenderer. The header and footer stay mounted during navigation. Use React Router
`Link` for internal page links; ordinary anchors remain appropriate for external
destinations. Page chunks load inside the shared layout, and navigation retains the
previous content until they are ready. Route scroll handling supports tool anchors,
new-page focus, and Back/Forward scroll restoration.

The initial canvas color is defined inline in `index.html` as `--page`, before the
bundled stylesheet or app code loads. Keep its color, the background token in
`src/index.css`, the theme-color metadata, and the manifest colors in sync.

The Trace article describes safeguards found in the implementation and controlled
tests. It does not claim a production firewall has been verified or an independent
security audit has been performed.

## Source publication

The Daggmask GitHub organization name is still undecided. Tool source links show
“Source code coming soon” until public repositories are ready. Do not replace these
labels with guessed organization URLs. The website does not advertise a source-code or MIT license link. Repository
visibility is managed separately on GitHub; changing this local notice does not
make an existing public repository private.

# Tools and writing redesign

Reading: a brand-preserving, Apple-inspired layout with visible examples and a fixed light palette.

DESIGN_VARIANCE: 7. MOTION_INTENSITY: 5. VISUAL_DENSITY: 3.

## Current direction

- Keep Daggmask’s monochrome identity, compact worm mark, Inter typography, large headlines, and generous spacing.
- Use light mode throughout, regardless of operating-system preference. Explicit root color-scheme and document metadata prevent automatic dark styling.
- Show Trace’s example alongside its copy, with Burrow and Loam examples directly below their descriptions. Examples are present on the page without opening a dialog.
- Use sample calendar events, URL parameters, and photo metadata. Loam uses a file summary rather than a photograph. No marketing artwork or blog covers are used.
- Animate each example once when it becomes visible, with a Replay control. Reduced motion shows the completed comparison immediately; generated HTML also contains completed examples for visitors without JavaScript.
- Keep blog cards typography-led, with the project, reading time, title, description, publication date, and article link.
- Preserve routes, navigation destinations, tool order, privacy statements, SEO metadata, article claims, and the website/tools licensing split.

## Foundation

Native CSS and existing Tailwind v3 components. This is an Apple-inspired web aesthetic, not an official Apple design system. Inter is retained as the established brand typeface. The explicit user requests for light mode and no imagery override the skill’s default dark-mode and image guidance.

The preceding image-based direction has been retired. Generated artwork, responsive-image helpers, cover metadata, and example-dialog components have been removed from the site.

## Validation

- Production build, TypeScript, targeted ESLint, and all 22 tests pass.
- Chromium checks confirm inline autoplay/replay, light styling under both system theme preferences, layouts from 320px to 1440px, reduced-motion results, and completed examples without JavaScript. No page images, example dialogs, external requests, or browser errors were observed.
- Mobile axe checks report zero WCAG A/AA violations on the homepage, blog, and article. Calendar inclusion labels use accessible text; article code blocks support keyboard scrolling with visible focus.

## Landing page polish

Reviewed against the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) on 14 October 2026, preserving the established design direction and the explicit light-only, image-free brief.

Resolved findings:

- src/index.css:94 - added a quiet 44px pause/resume control for the continuous decorative worm. Reduced motion hides the control and keeps the worm still.
- src/index.css:109 - privacy-note rows can grow with longer text instead of clipping it in a fixed-height track.
- src/index.css:136 - the case-study keyboard focus ring sits inside the rounded card, where overflow cannot clip it.
- src/index.css:163 - larger example text, tabular calendar times, and stable result space improve readability while retaining aligned desktop panels.
- src/index.css:293 - mobile navigation keeps the logo and primary links together, with the GitHub notice on a secondary row.
- src/pages/Index.tsx:16 - the keyboard skip link has a focusable main-content target.
- index.html:7 - browser chrome and the installed-app background match the light page color.
- src/App.tsx:1 - removed unused query, toast, and tooltip providers. Main JavaScript fell from 439.49kB to 296.75kB; gzip transfer fell from 142.63kB to 97.31kB, about 32%.

Final Chromium checks pass for skip-link focus, case-study focus visibility, pause/resume without restarting the worm, inline replay without height changes, both system theme preferences, widths from 320px to 1440px, expanded WCAG text spacing, reduced motion, and completed examples without JavaScript. No external requests or browser errors were observed. Axe reports zero WCAG A/AA violations on all three routes at desktop and 320px widths.

Final local Lighthouse using default simulated mobile throttling and gzip text compression: performance 98, accessibility 100, best practices 100, SEO 100. FCP 1.6s, LCP 2.2s, CLS 0, total blocking time 0ms. These are local lab measurements, not production field data.

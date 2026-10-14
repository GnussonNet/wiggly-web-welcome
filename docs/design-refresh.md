# Tools and writing redesign

Reading: a brand-preserving, Apple-inspired layout with visible examples and a fixed light palette.

DESIGN_VARIANCE: 7. MOTION_INTENSITY: 5. VISUAL_DENSITY: 3.

## Current direction

- Keep Daggmask’s monochrome identity, compact worm mark, Inter typography, large headlines, and generous spacing.
- Use light mode throughout, regardless of operating-system preference. Explicit root color-scheme, document metadata, and toast theme prevent automatic dark styling.
- Show Trace’s example alongside its copy, with Burrow and Loam examples directly below their descriptions. Examples are present on the page without opening a dialog.
- Use sample calendar events, URL parameters, and photo metadata. Loam uses a file summary rather than a photograph. No marketing artwork or blog covers are used.
- Animate each example once when it becomes visible, with a Replay control. Reduced motion shows the completed comparison immediately; generated HTML also contains completed examples for visitors without JavaScript.
- Keep blog cards typography-led, with the project, reading time, title, description, publication date, and article link.
- Preserve routes, navigation destinations, tool order, privacy statements, SEO metadata, article claims, and the website/tools licensing split.

## Foundation

Native CSS and existing Tailwind v3 components. This is an Apple-inspired web aesthetic, not an official Apple design system. Inter is retained as the established brand typeface. The explicit user requests for light mode and no imagery override the skill’s default dark-mode and image guidance.

The preceding image-based direction has been retired. Generated artwork, responsive-image helpers, cover metadata, and example-dialog components have been removed from the site.

## Validation

- Production build, TypeScript, targeted ESLint, and all 21 tests pass.
- Chromium checks confirm inline autoplay/replay, light styling under both system theme preferences, layouts from 320px to 1440px, reduced-motion results, and completed examples without JavaScript. No page images, example dialogs, external requests, or browser errors were observed.
- Mobile axe checks report zero WCAG A/AA violations on the homepage, blog, and article. Calendar inclusion labels use accessible text; article code blocks support keyboard scrolling with visible focus.

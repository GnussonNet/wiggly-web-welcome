export const PROJECTS = [
  {
    id: "trace", name: "Trace", headline: "Share the link without the tracking.",
    description: "Inspect a link, remove known tracking parameters, and check where it leads before you share.",
    privacy: "Cleaning happens in your browser. Redirect checks contact destinations through the server.",
    href: "https://trace.daggmask.com",
  },
  {
    id: "burrow", name: "Burrow", headline: "Keep the events that matter.",
    description: "Turn a crowded calendar into a filtered subscription. Choose your rules and keep the events you need.",
    privacy: "Your original calendar stays unchanged. Burrow creates a separate, filtered subscription.",
    href: "https://burrow.daggmask.com",
  },
  {
    id: "loam", name: "Loam", headline: "Keep the photo. Leave the metadata.",
    description: "See the hidden details in your photos. Remove descriptive metadata and save a cleaned copy, right in your browser.",
    privacy: "Your photos stay in your browser. No upload, no account.",
    href: "https://loam.daggmask.com",
  },
] as const;

export type ProjectId = typeof PROJECTS[number]["id"];

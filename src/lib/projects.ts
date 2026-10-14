export const PROJECTS = [
  {
    id: "trace", name: "Trace", headline: "Share the link without the tracking.",
    description: "Unpack a URL, remove known tracking parameters, and keep the parts you need. Check redirects when you want to see where a link leads.",
    privacy: "Cleaning happens in your browser. Redirect checks contact destinations through the server.",
    href: "https://trace.daggmask.com",
  },
  {
    id: "burrow", name: "Burrow", headline: "Keep the events that matter.",
    description: "Turn a crowded calendar into a view that works for you. Connect a calendar feed, choose your rules, and subscribe to just the events you need.",
    privacy: "Your original calendar stays unchanged. Burrow creates a separate, filtered subscription.",
    href: "https://burrow.daggmask.com",
  },
  {
    id: "loam", name: "Loam", headline: "Keep the photo. Leave the metadata.",
    description: "Photos can carry location, camera details, and more. See what’s attached, remove descriptive metadata, and download a cleaned copy before you share.",
    privacy: "Your photos stay in your browser. No upload, no account.",
    href: "https://loam.daggmask.com",
  },
] as const;

export type ProjectId = typeof PROJECTS[number]["id"];

import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import type { BlogPages } from "./SiteRoutes";
import "./index.css";

async function start() {
  const container = document.getElementById("root")!;
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const blogPages: Partial<BlogPages> = {};
  // Resolve the active page before hydration so its existing HTML stays visible.
  if (path === "/blog") blogPages.Blog = (await import("./pages/Blog")).default;
  else if (path.startsWith("/blog/")) blogPages.BlogPost = (await import("./pages/BlogPost")).default;
  const app = <App blogPages={blogPages} />;
  if (container.dataset.prerenderedPath === path) hydrateRoot(container, app);
  else createRoot(container).render(app);
}

void start();

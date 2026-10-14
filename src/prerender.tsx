import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import SiteRoutes from "./SiteRoutes";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { POSTS, postHref } from "./lib/blog";
import { HOME_METADATA, BLOG_METADATA, type PageMetadata } from "./lib/page-metadata";

export const staticPages: PageMetadata[] = [HOME_METADATA, BLOG_METADATA, ...POSTS.map((post) => ({
  path: postHref(post), title: `${post.title} — Daggmask`, description: post.description, article: true,
}))];

export function renderPage(path: string) {
  return renderToString(<StaticRouter location={path}><SiteRoutes blogPages={{ Blog, BlogPost }} /></StaticRouter>);
}

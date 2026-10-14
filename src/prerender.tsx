import { renderToString } from "react-dom/server";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { POSTS, postHref } from "./lib/blog";
import { BLOG_METADATA, type PageMetadata } from "./lib/page-metadata";

export const staticPages: PageMetadata[] = [BLOG_METADATA, ...POSTS.map((post) => ({
  path: postHref(post), title: `${post.title} — Daggmask`, description: post.description, article: true,
}))];

export function renderPage(path: string) {
  return renderToString(<StaticRouter location={path}><Routes>
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
  </Routes></StaticRouter>);
}

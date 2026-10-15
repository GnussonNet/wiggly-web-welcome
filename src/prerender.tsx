import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import SiteRoutes from "./SiteRoutes";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { POSTS } from "./lib/blog";
import { HOME_METADATA, BLOG_METADATA, postMetadata, DEFAULT_SHARE_IMAGE, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT, SITE_ORIGIN, type PageMetadata } from "./lib/page-metadata";
export { DEFAULT_SHARE_IMAGE, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT, SITE_ORIGIN };

export const staticPages: PageMetadata[] = [HOME_METADATA, BLOG_METADATA, ...POSTS.map(postMetadata)];

export function renderPage(path: string) {
  return renderToString(<StaticRouter location={path}><SiteRoutes blogPages={{ Blog, BlogPost }} /></StaticRouter>);
}

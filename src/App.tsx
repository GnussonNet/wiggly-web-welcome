import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import SiteRoutes, { type BlogPages } from "./SiteRoutes";

const LazyBlog = lazy(() => import("./pages/Blog"));
const LazyBlogPost = lazy(() => import("./pages/BlogPost"));

const App = ({ blogPages = {} }: { blogPages?: Partial<BlogPages> }) => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SiteRoutes blogPages={{ Blog: blogPages.Blog ?? LazyBlog, BlogPost: blogPages.BlogPost ?? LazyBlogPost }} />
    </BrowserRouter>
  );
};

export default App;

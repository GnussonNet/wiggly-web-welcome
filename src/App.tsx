import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const LazyBlog = lazy(() => import("./pages/Blog"));
const LazyBlogPost = lazy(() => import("./pages/BlogPost"));

type BlogPages = { Blog: ComponentType; BlogPost: ComponentType };

const App = ({ blogPages }: { blogPages?: BlogPages }) => {
  const Blog = blogPages?.Blog ?? LazyBlog;
  const BlogPost = blogPages?.BlogPost ?? LazyBlogPost;
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="page-width route-loading" role="status">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

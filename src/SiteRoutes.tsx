import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export type BlogPages = { Blog: ComponentType; BlogPost: ComponentType };

export default function SiteRoutes({ blogPages: { Blog, BlogPost } }: { blogPages: BlogPages }) {
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<Index />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}

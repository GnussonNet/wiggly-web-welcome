import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import RouteScroll from "./RouteScroll";

export default function SiteLayout() {
  return <div id="top" className="landing-page">
    <SiteHeader />
    <Suspense fallback={<main id="main-content" tabIndex={-1} className="page-width route-loading" role="status">Loading…</main>}>
      <RouteScroll />
      <Outlet />
    </Suspense>
    <SiteFooter />
  </div>;
}

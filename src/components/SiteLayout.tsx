import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import RouteScroll from "./RouteScroll";

export default function SiteLayout() {
  const { pathname } = useLocation();
  return <div id="top" className="landing-page">
    <SiteHeader home={pathname === "/"} />
    <Suspense fallback={<main id="main-content" tabIndex={-1} className="page-width route-loading" role="status">Loading…</main>}>
      <RouteScroll />
      <Outlet />
    </Suspense>
    <SiteFooter />
  </div>;
}

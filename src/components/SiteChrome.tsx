import { PROJECTS } from "@/lib/projects";
import { Link } from "react-router-dom";
import WormLogo from "./WormLogo";

export function SiteHeader({ home = false }: { home?: boolean }) {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header page-width">
      <WormLogo />
      <nav aria-label="Main navigation">
        {home ? PROJECTS.map((project) => <Link key={project.id} to={`/#${project.id}`} translate="no">{project.name}</Link>) : <Link to="/#tools">Tools</Link>}
        <Link to="/blog">Blog</Link>
        <span className="nav-pending" title="The Daggmask GitHub organization is coming soon">GitHub <small>coming soon</small></span>
      </nav>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer page-width">
    <span>© {new Date().getFullYear()} daggmask. All rights reserved.</span>
  </footer>;
}

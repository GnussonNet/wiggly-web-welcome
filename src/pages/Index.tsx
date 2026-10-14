import { ArrowDown, ArrowUpRight } from "lucide-react";
import Worm from "@/components/Worm";
import ToolDemo from "@/components/ToolDemo";
import StoryCard from "@/components/StoryCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PROJECTS } from "@/lib/projects";
import { POSTS } from "@/lib/blog";
import { HOME_METADATA } from "@/lib/page-metadata";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function Index() {
  usePageMetadata(HOME_METADATA);
  const featured = POSTS[0];
  return <div id="top" className="landing-page">
    <SiteHeader home />
    <main id="main-content">
      <section className="landing-hero" aria-labelledby="hero-title">
        <Worm />
        <div className="hero-content page-width">
          <h1 id="hero-title">Keep control of<br className="hero-break" /> what you share.</h1>
          <p>See what your photos reveal, clean up links, and choose what belongs in your calendar.</p>
          <a className="explore-link" href="#tools">Explore the tools<ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="tools" className="tools-collection page-width" aria-labelledby="tools-title">
        <header className="collection-heading"><h2 id="tools-title">The tools.</h2><p>A little less noise. A little more control.</p></header>
        <div className="tools-grid">
          {PROJECTS.map((project) => <section key={project.id} id={project.id} className={`project-section product-tile product-tile-${project.id}`} aria-labelledby={`${project.id}-name`}>
            <div className="project-copy">
              <h3 id={`${project.id}-name`}>{project.name}</h3>
              <p className="project-headline">{project.headline}</p>
              <p className="project-description">{project.description}</p>
              <div className="project-actions">
                <a className="open-tool" href={project.href} target="_blank" rel="noopener noreferrer">Open {project.name}<ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </div>
            <div className="product-example"><ToolDemo tool={project.id} name={project.name} /></div>
            <div className="product-detail"><p className="project-privacy">{project.privacy}</p><span className="source-pending">Source code coming soon</span></div>
          </section>)}
        </div>
      </section>

      {featured && <section className="featured-writing page-width" aria-labelledby="writing-heading">
        <header className="collection-heading"><h2 id="writing-heading">Behind the tools.</h2><p>The decisions, tradeoffs, and limits behind what we build.</p></header>
        <StoryCard post={featured} />
      </section>}
    </main>
    <SiteFooter />
  </div>;
}

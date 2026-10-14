import { ArrowDown, ArrowUpRight } from "lucide-react";
import Worm from "@/components/Worm";
import ToolDemo from "@/components/ToolDemo";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PROJECTS } from "@/lib/projects";
import { POSTS, postHref } from "@/lib/blog";
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
          <p>See what your photos reveal, remove tracking from links, and choose what belongs in your calendar. Three focused tools from Daggmask.</p>
          <a className="explore-link" href="#tools">Explore the tools <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <div id="tools" className="projects page-width">
        {PROJECTS.map((project) => <section key={project.id} id={project.id} className="project-section" aria-labelledby={`${project.id}-name`}>
          <div className="project-copy">
            <h2 id={`${project.id}-name`}>{project.name}</h2>
            <h3>{project.headline}</h3>
            <p className="project-description">{project.description}</p>
            <p className="project-privacy">{project.privacy}</p>
            <div className="project-actions"><a className="open-tool" href={project.href} target="_blank" rel="noopener noreferrer">Open {project.name}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><span className="source-pending">Source code coming soon</span></div>
            {POSTS.filter((post) => post.project === project.id).map((post) => <a className="case-study-link" href={postHref(post)} key={post.slug}>Read the security case study<ArrowUpRight size={14} aria-hidden="true" /></a>)}
          </div>
          <ToolDemo tool={project.id} name={project.name} />
        </section>)}
      </div>
      {featured && <section className="featured-writing page-width" aria-labelledby="writing-heading">
        <div><h2 id="writing-heading">Behind the tools.</h2><p>Security choices are easier to trust when the reasoning is visible.</p><a className="text-link" href="/blog">Visit the blog<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        <article><span className="writing-project">{PROJECTS.find((project) => project.id === featured.project)!.name} case study</span><h3><a href={postHref(featured)}>{featured.title}<ArrowUpRight size={21} aria-hidden="true" /></a></h3><p>{featured.description}</p></article>
      </section>}
    </main>

    <SiteFooter />
  </div>;
}

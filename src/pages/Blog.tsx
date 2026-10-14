import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import StoryCard from "@/components/StoryCard";
import { POSTS } from "@/lib/blog";
import { PROJECTS } from "@/lib/projects";
import { BLOG_METADATA } from "@/lib/page-metadata";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function Blog() {
  usePageMetadata(BLOG_METADATA);
  return <div className="landing-page">
    <SiteHeader />
    <main id="main-content" className="writing-main page-width">
      <header className="writing-intro"><h1>Notes from the build.</h1><p>The security decisions, tradeoffs, and tests behind the tools. Written to make the reasoning easier to inspect.</p></header>
      {PROJECTS.map((project) => {
        const posts = POSTS.filter((post) => post.project === project.id);
        return posts.length ? <section className="post-group" key={project.id} aria-labelledby={`${project.id}-posts`}>
          <h2 id={`${project.id}-posts`}>{project.name}</h2>
          <div className="stories-grid">{posts.map((post) => <StoryCard post={post} key={post.slug} />)}</div>
        </section> : null;
      })}
      {!POSTS.length && <div className="writing-empty"><h2>More to share soon.</h2><p>Case studies will appear here as they’re published.</p></div>}
    </main>
    <SiteFooter />
  </div>;
}

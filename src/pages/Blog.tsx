import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { formatPostDate, POSTS, postHref } from "@/lib/blog";
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
          <div>{posts.map((post) => <article className="post-preview" key={post.slug}>
            <div className="post-date"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.readingMinutes} min read</span></div>
            <h3><a href={postHref(post)}>{post.title}<ArrowUpRight size={20} aria-hidden="true" /></a></h3>
            <p>{post.description}</p>
          </article>)}</div>
        </section> : null;
      })}
    </main>
    <SiteFooter />
  </div>;
}

import { Link } from "react-router-dom";
import { formatPostDate, POSTS, postHref } from "@/lib/blog";
import { PROJECTS } from "@/lib/projects";
import { BLOG_METADATA } from "@/lib/page-metadata";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function Blog() {
  usePageMetadata(BLOG_METADATA);
  return <main id="main-content" tabIndex={-1} className="writing-main page-width">
      <header className="writing-intro"><h1>Notes from the build.</h1><p>The security decisions, tradeoffs, and tests behind the tools. Written to make the reasoning easier to inspect.</p></header>
      {!!POSTS.length && <ol className="post-list" aria-label="All posts, newest first">
        {POSTS.map((post) => <li key={post.slug}>
          <article className="post-preview" aria-labelledby={`${post.slug}-title`}>
            <Link className="post-preview-link" to={postHref(post)}>
              <div className="post-preview-date"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.readingMinutes} min read</span></div>
              <div className="post-preview-content">
                <span className="post-preview-tool" translate="no">{PROJECTS.find((project) => project.id === post.project)!.name}</span>
                <h2 id={`${post.slug}-title`}>{post.title}</h2>
                <p>{post.description}</p>
              </div>
            </Link>
          </article>
        </li>)}
      </ol>}
      {!POSTS.length && <div className="writing-empty"><h2>More to share soon.</h2><p>Case studies will appear here as they’re published.</p></div>}
  </main>;
}

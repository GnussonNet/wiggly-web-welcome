import Markdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { formatPostDate, POSTS, postHref } from "@/lib/blog";
import { PROJECTS } from "@/lib/projects";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((candidate) => candidate.slug === slug);
  usePageMetadata(post ? {
    title: `${post.title} — Daggmask`, description: post.description, path: postHref(post), article: true,
  } : { title: "Article not found — Daggmask", description: "This article could not be found.", path: `/blog/${slug ?? ""}`, noindex: true });
  if (!post) return <NotFound />;
  const project = PROJECTS.find((candidate) => candidate.id === post.project)!;
  return <main id="main-content" tabIndex={-1} className="article-main page-width">
      <article className="case-study">
        <header className="article-header">
          <Link className="back-to-blog" to="/blog">All posts</Link>
          <div className="article-meta"><Link to={`/#${project.id}`}>{project.name}</Link><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.readingMinutes} min read</span></div>
          <h1>{post.title}</h1><p className="article-description">{post.description}</p>
        </header>
        <div className="article-body"><Markdown skipHtml components={{
          a: ({ children, href }) => href?.startsWith("/") && !href.startsWith("//") ? <Link to={href}>{children}</Link> : <a href={href} {...(href?.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>,
          h1: ({ children }) => <h2>{children}</h2>,
          pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
        }}>{post.body}</Markdown></div>
        <footer className="article-end"><a href={project.href} target="_blank" rel="noopener noreferrer">Open {project.name}<span className="sr-only"> (opens in a new tab)</span></a><Link to="/blog">More from the build</Link></footer>
      </article>
  </main>;
}

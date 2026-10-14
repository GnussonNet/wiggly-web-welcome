import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPostDate, type Post, postHref } from "@/lib/blog";
import { PROJECTS } from "@/lib/projects";

export default function StoryCard({ post, headingLevel = 3 }: { post: Post; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const project = PROJECTS.find((candidate) => candidate.id === post.project)!;
  return <article className="story-card" aria-labelledby={`${post.slug}-title`}>
    <Link className="story-card-link" to={postHref(post)}>
      <div className="story-content">
        <div className="story-meta"><span>{project.name} case study</span><span>{post.readingMinutes} min read</span></div>
        <Heading id={`${post.slug}-title`}>{post.title}</Heading>
        <p>{post.description}</p>
        <div className="story-bottom"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span className="story-cta">Read case study<ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" /></span></div>
      </div>
    </Link>
  </article>;
}

import { describe, expect, it } from "vitest";
import { parsePost, POSTS, postHref } from "./blog";

const post = (fields = "", body = "A case study.") => `---\ntitle: "A security decision"\ndescription: "An accessible explanation."\ndate: "2026-10-14"\nproject: "trace"\n${fields}---\n${body}`;

describe("Markdown publishing", () => {
  it("loads the Trace case study and derives its stable route from the filename", () => {
    const trace = POSTS.find((post) => post.slug === "trace-redirect-safety")!;
    expect(trace.project).toBe("trace");
    expect(postHref(trace)).toBe("/blog/trace-redirect-safety");
    expect(trace.readingMinutes).toBeGreaterThan(1);
    expect(trace.body).toContain("not an independent security audit");
    expect(trace.body).toContain("operator assertion");
  });
  it("supports ordinary Markdown and Windows line endings", () => {
    const result = parsePost(post("", "## A boundary\n\n- A deliberate limitation").replace(/\n/g, "\r\n"), "a-decision.md");
    expect(result.slug).toBe("a-decision");
    expect(result.body).toContain("## A boundary");
  });
  it.each([
    ["frontmatter", () => "No metadata"],
    ["unknown project", () => post().replace('project: "trace"', 'project: "unknown"')],
    ["invalid date", () => post().replace('"2026-10-14"', '"2026-02-30"')],
    ["missing title", () => post().replace('title: "A security decision"\n', "")],
    ["empty body", () => post("", "")],
  ])("rejects %s before publication", (_label, source) => {
    expect(() => parsePost(source(), "test-post.md")).toThrow();
  });
});

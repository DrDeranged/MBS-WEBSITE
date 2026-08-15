import { type ReactElement } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";
import { POSTS, APPLY_URL } from "@/content/blog";

interface Props {
  params: { slug: string };
}

// ── Minimal markdown-like body renderer ──────────────────────────────────────
// Supports: **bold**, [text](url), \n\n paragraph breaks. No external dep.
function renderBody(text: string) {
  return text.split("\n\n").map((para, pi) => {
    // Convert inline markdown
    const parts: (string | ReactElement)[] = [];
    let remaining = para;
    let key = 0;

    while (remaining.length > 0) {
      // Links: [text](url)
      const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        if (linkMatch[1]) parts.push(linkMatch[1]);
        parts.push(
          <a
            key={key++}
            href={linkMatch[3]}
            target={linkMatch[3].startsWith("http") ? "_blank" : undefined}
            rel={linkMatch[3].startsWith("http") ? "noopener noreferrer" : undefined}
            className="underline font-medium transition-colors"
            style={{ color: "#1F4E79" }}
          >
            {linkMatch[2]}
          </a>,
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }
      // Bold: **text**
      const boldMatch = remaining.match(/^([\s\S]*?)\*\*([^*]+)\*\*/);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(boldMatch[1]);
        parts.push(<strong key={key++}>{boldMatch[2]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      parts.push(remaining);
      break;
    }

    return (
      <p key={pi} className="text-muted-foreground leading-relaxed mb-0">
        {parts}
      </p>
    );
  });
}

export default function BlogArticle({ params }: Props) {
  const post = POSTS.find((p) => p.slug === params.slug);

  usePageMeta(
    post ? `${post.title} | My Business Solutions` : "Article not found | MBS",
    post?.excerpt,
  );

  if (!post) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-40 text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-4">
            Article not found
          </h1>
          <Link href="/blog" className="underline font-medium" style={{ color: "#1F4E79" }}>
            ← Back to blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ── ARTICLE HEADER ───────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-24"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All articles
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {post.date}
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {post.readTime}
              </span>
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {post.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-3xl px-6">
          {/* Excerpt (lead paragraph) */}
          <Reveal>
            <p
              className="text-xl leading-relaxed mb-12 font-medium"
              style={{ color: "#1F4E79" }}
            >
              {post.excerpt}
            </p>
          </Reveal>

          {/* Sections */}
          <div className="space-y-10">
            {post.sections.map((section, i) => (
              <Reveal key={i} delay={i * 60}>
                <div>
                  {section.heading && (
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-4">
                      {section.heading}
                    </h2>
                  )}
                  <div className="space-y-4">{renderBody(section.body)}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <Reveal delay={120}>
            <div
              className="mt-16 rounded-2xl p-8 md:p-10 text-center"
              style={{ background: "linear-gradient(135deg, #1F4E79 0%, #0E2A47 100%)" }}
            >
              <h3 className="font-heading font-bold text-2xl text-white mb-3">
                Ready to see your funding options?
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                One application. Multiple lenders. Real offers — no obligation.
              </p>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: "#17A567" }}
              >
                Apply now — it's free
              </a>
            </div>
          </Reveal>

          {/* Back link */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              style={{ color: "#46586C" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to all articles
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

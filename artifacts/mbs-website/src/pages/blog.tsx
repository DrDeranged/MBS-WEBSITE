import { Link } from "wouter";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { POSTS } from "@/content/blog";

export default function Blog() {
  usePageMeta(
    "Business Funding Blog | My Business Solutions",
    "Practical guides on business funding — working capital, term loans, bank statements, and how to prepare your application.",
  );

  return (
    <Layout>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p
              className="font-sans font-semibold text-[12px] uppercase mb-4 tracking-widest"
              style={{ color: "#17A567" }}
            >
              Resources
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Business Funding Guides
            </h1>
            <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
              Plain-spoken education on business financing — no jargon, no promises.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── POST GRID ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Articles" heading="Learn about business funding" />
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {POSTS.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article
                    className="h-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                    style={{ borderColor: "#DCE4EC" }}
                  >
                    {/* Colour band */}
                    <div
                      className="h-2 w-full flex-none"
                      style={{ backgroundColor: "#17A567" }}
                    />
                    <div className="flex flex-col flex-1 p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h2 className="font-heading font-semibold text-lg text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <p
                        className="mt-5 text-sm font-semibold inline-flex items-center gap-1 transition-colors group-hover:gap-2"
                        style={{ color: "#1F4E79" }}
                      >
                        Read article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </p>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

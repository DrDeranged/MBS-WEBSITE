import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { GradientBand } from "@/components/motion/GradientBand";

const APPLY_URL = "https://app.my-business-solutions.com/apply";

// ── Step icon with fallback ───────────────────────────────────────────────────
function StepIcon({ slug, alt }: { slug: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={`/images/icons/${slug}`}
      alt={alt}
      className="w-10 h-10 mb-4 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

// ── How It Works data (same as home) ─────────────────────────────────────────
const STEPS = [
  { num: "01", icon: "apply-online.svg",    title: "Apply online",    copy: "Complete a short application with basic business and financial information." },
  { num: "02", icon: "get-matched.svg",     title: "Get matched",     copy: "Your profile is reviewed and matched with lenders aligned with your business needs." },
  { num: "03", icon: "compare-offers.svg",  title: "Compare offers",  copy: "Review available terms, repayment structures, and funding amounts." },
  { num: "04", icon: "get-funded.svg",      title: "Get funded",      copy: "Select an offer and receive funds to support your business goals." },
];

export default function About() {
  usePageMeta(
    "About Us | My Business Solutions",
    "We help businesses navigate the funding process with clarity and confidence, making it easier to explore financing options in one place.",
  );

  return (
    <Layout>
      {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
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
              Who we are
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              About My Business Solutions
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
              We help businesses navigate the funding process with clarity and
              confidence, making it easier to explore financing options in one place.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── MISSION ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: mission copy (verbatim from live site) */}
            <Reveal delay={0}>
              <p
                className="font-sans font-semibold text-[12px] uppercase mb-3 tracking-widest"
                style={{ color: "#17A567" }}
              >
                Our purpose
              </p>
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-3">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    We help small businesses access financing by simplifying the funding
                    process and providing transparent options in one place.
                  </p>
                </div>
                <div
                  className="h-px w-16"
                  style={{ backgroundColor: "#17A567" }}
                />
                <div>
                  <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-3">
                    Our Approach
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    We focus on clarity, speed, and choice so business owners can make
                    confident financing decisions.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Right: visual card */}
            <Reveal delay={150}>
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "linear-gradient(145deg, #1F4E79 0%, #0E2A47 100%)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-6"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  What we offer
                </p>
                {[
                  "One application, multiple lenders",
                  "Six funding product types",
                  "Transparent comparison of options",
                  "Guidance through every step",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 mb-4 last:mb-0">
                    <span
                      className="mt-1 flex-none w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#17A567" }}
                    >
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (reused from home) ──────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5F8FB" }}
        className="py-24 md:py-32 border-y border-border"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="The process" heading="How it works" />
          </Reveal>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
            <div
              className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px"
              style={{ backgroundColor: "#DCE4EC" }}
            />
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="relative flex flex-col items-center text-center px-4">
                  <div
                    className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg mb-6 bg-white border-2 tabular-nums"
                    style={{ borderColor: "#17A567", color: "#17A567" }}
                  >
                    {step.num}
                  </div>
                  <StepIcon slug={step.icon} alt={step.title} />
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mobile: vertical list */}
          <div className="flex flex-col gap-6 md:hidden">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div className="flex gap-5 items-start">
                  <div
                    className="flex-none w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-base tabular-nums"
                    style={{ backgroundColor: "#1F4E79", color: "#fff" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <StepIcon slug={step.icon} alt={step.title} />
                    <h3 className="font-heading font-semibold text-base text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADIENT BAND CTA ─────────────────────────────────────────────── */}
      <GradientBand
        heading="Ready to explore your options?"
        ctaLabel="Apply now — it takes minutes"
        ctaHref={APPLY_URL}
      />
    </Layout>
  );
}

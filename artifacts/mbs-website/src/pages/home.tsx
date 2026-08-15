import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { GradientBand } from "@/components/motion/GradientBand";
import { useState } from "react";

// ── Icon with navy-circled-initial fallback ───────────────────────────────────
function SectionIcon({
  slug,
  alt,
  className = "w-12 h-12 mb-5",
}: {
  slug: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = alt.charAt(0).toUpperCase();
  if (failed) {
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-heading font-bold text-xl ${className}`}
        style={{ backgroundColor: "#1F4E79" }}
      >
        {initial}
      </div>
    );
  }
  return (
    <img
      src={`/images/icons/${slug}`}
      alt={alt}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

// ── Hero mock panel ───────────────────────────────────────────────────────────
const MOCK_OFFERS = [
  { label: "TERM LOAN", amount: "$75,000" },
  { label: "LINE OF CREDIT", amount: "$120,000" },
  { label: "REVENUE-BASED", amount: "$45,000" },
];

function HeroMockPanel() {
  return (
    <div
      className="relative flex flex-col justify-center px-8 py-10 min-h-[360px]"
      style={{
        background: "linear-gradient(145deg, #1F4E79 0%, #0E2A47 100%)",
        borderRadius: "12px",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
        Funding options
      </p>
      <div className="flex flex-col gap-4">
        {MOCK_OFFERS.map((offer, i) => (
          <div
            key={offer.label}
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 flex items-center justify-between"
            style={{
              transform: `rotate(${[-1, 0.5, -0.5][i]}deg) translateX(${[4, 0, -4][i]}px)`,
            }}
          >
            <div>
              <p className="text-[11px] font-mono font-semibold text-white/50 tracking-widest mb-1">
                {offer.label}
              </p>
              <p className="tabular-nums text-white font-heading font-bold text-2xl">
                {offer.amount}
              </p>
            </div>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: "#17A567" }}
            >
              Matched
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-white/30 mt-6 text-right">
        Illustrative example
      </p>
    </div>
  );
}

// ── Funding Products ──────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    icon: "business-term.svg",
    title: "Business Term Loan",
    copy: "Competitive rates and extended repayment terms designed to support your cash flow.",
  },
  {
    icon: "business-line.svg",
    title: "Business Line of Credit",
    copy: "Flexible access to capital to help manage cash flow and fuel business growth.",
  },
  {
    icon: "revenue-based.svg",
    title: "Revenue-Based Financing",
    copy: "Quick, straightforward funding so you can stay focused on running your business.",
  },
  {
    icon: "euipment-financing.svg",
    title: "Equipment Financing",
    copy: "Finance up to 100% of your equipment costs with industry-leading rates and terms.",
  },
  {
    icon: "sba-loan.svg",
    title: "SBA Loan",
    copy: "A range of SBA loan options to help your business achieve long-term growth.",
  },
  {
    icon: "invoice-factory.svg",
    title: "Invoice Factoring",
    copy: "Turn outstanding invoices into immediate cash and eliminate long payment delays.",
  },
];

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    icon: "apply-online.svg",
    title: "Apply online",
    copy: "Complete a short application with basic business and financial information.",
  },
  {
    num: "02",
    icon: "get-matched.svg",
    title: "Get matched",
    copy: "Your profile is reviewed and matched with lenders aligned with your business needs.",
  },
  {
    num: "03",
    icon: "compare-offers.svg",
    title: "Compare offers",
    copy: "Review available terms, repayment structures, and funding amounts.",
  },
  {
    num: "04",
    icon: "get-funded.svg",
    title: "Get funded",
    copy: "Select an offer and receive funds to support your business goals.",
  },
];

// ── Why Us ────────────────────────────────────────────────────────────────────
const WHY_US = [
  {
    icon: "one-application.svg",
    title: "One application",
    copy: "Complete a single application and unlock access to multiple lenders and funding products at once.",
  },
  {
    icon: "multiple-options.svg",
    title: "Multiple options",
    copy: "We match you with a range of financing solutions tailored to your business profile and goals.",
  },
  {
    icon: "fast-decisions.svg",
    title: "Fast decisions",
    copy: "Receive matched funding options typically within 24 hours of completing your application.",
  },
  {
    icon: "dedicated-support.svg",
    title: "Dedicated support",
    copy: "Our team is here to guide you through the process and help you choose the right offer.",
  },
];

// ── Calculator teaser mock ────────────────────────────────────────────────────
function CalcMock() {
  return (
    <div
      className="bg-white border border-border shadow-lg p-6"
      style={{ borderRadius: "12px" }}
    >
      <p className="font-heading font-semibold text-foreground mb-5">
        Payment estimator
      </p>
      {[
        { label: "Funding Amount", value: "$150,000", pct: 60 },
        { label: "Term Length", value: "36 mo", pct: 45 },
        { label: "Estimated Rate", value: "7.5%", pct: 30 },
      ].map((row) => (
        <div key={row.label} className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">{row.label}</span>
            <span className="tabular-nums font-semibold text-foreground">
              {row.value}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${row.pct}%`, backgroundColor: "#1F4E79" }}
            />
          </div>
        </div>
      ))}
      <div
        className="rounded-xl px-5 py-4 mt-6"
        style={{ backgroundColor: "#F5F8FB" }}
      >
        <p className="text-sm text-muted-foreground mb-1">Estimated monthly payment</p>
        <p
          className="tabular-nums font-heading font-bold text-3xl"
          style={{ color: "#1F4E79" }}
        >
          $4,635
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  usePageMeta(
    "My Business Solutions | Smart Business Funding, Simplified",
    "Apply once and access multiple business funding options tailored to your company's needs. Compare offers, choose confidently, and move forward faster.",
  );

  return (
    <Layout>
      {/* ── A) HERO ─────────────────────────────────────────────────────── */}
      <section className="min-h-[calc(100vh-80px)] flex items-center bg-background pt-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={0}>
              <h1 className="font-heading font-bold text-[36px] md:text-[56px] leading-[1.1] tracking-tight text-foreground mb-5">
                Smart business funding, simplified
              </h1>
              <p className="font-heading font-semibold text-xl md:text-2xl text-primary mb-6">
                Get matched with the right financing
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Apply once and access multiple business funding options tailored to
                your company's needs. Compare offers, choose confidently, and move
                forward faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://app.my-business-solutions.com/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: "#17A567" }}
                >
                  Check your options
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border-2 border-border text-foreground px-8 py-4 text-base font-semibold transition-all duration-200 hover:border-primary hover:text-primary"
                >
                  How it works
                </a>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <HeroMockPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── B) TRUST STRIP ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F8FB" }} className="py-10 border-y border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:divide-x divide-border">
            {[
              { value: "6", label: "funding products" },
              { value: "1", label: "application" },
              { value: "24hr", label: "typical response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:px-8 first:pl-0 last:pr-0">
                <p
                  className="font-heading font-bold text-4xl mb-1 tabular-nums"
                  style={{ color: "#1F4E79" }}
                >
                  <CountUp value={stat.value} />
                </p>
                <p
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ letterSpacing: "0.06em", color: "#46586C" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── C) FUNDING PRODUCTS ────────────────────────────────────────── */}
      <section id="products" className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Funding solutions"
              heading="Flexible financing for every stage of your business"
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.icon} delay={i * 80}>
                <TiltCard className="h-full">
                  <SectionIcon slug={p.icon} alt={p.title} />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {p.copy}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── D) HOW IT WORKS ────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{ backgroundColor: "#F5F8FB" }}
        className="py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Funding made simple" heading="How it works" />
          </Reveal>
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
                  <SectionIcon slug={step.icon} alt={step.title} className="w-10 h-10 mb-4 object-contain" />
                  <h3 className="font-heading font-semibold text-base text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="flex flex-col gap-6 md:hidden">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div className="flex gap-5 items-start">
                  <div
                    className="flex-none w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-base tabular-nums"
                    style={{ backgroundColor: "#1F4E79", color: "#ffffff" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <SectionIcon slug={step.icon} alt={step.title} className="w-8 h-8 mb-2 object-contain" />
                    <h3 className="font-heading font-semibold text-base text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── E) WHY US ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Why choose us" heading="Why businesses choose us" />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <TiltCard className="h-full">
                  <SectionIcon slug={item.icon} alt={item.title} />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.copy}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── F) CALCULATOR TEASER ───────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5F8FB" }}
        className="py-24 md:py-32 border-y border-border"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={0}>
              <p
                className="font-sans font-semibold text-[12px] uppercase mb-3"
                style={{ letterSpacing: "0.08em", color: "#17A567" }}
              >
                Payment calculator
              </p>
              <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-5 leading-tight">
                Estimate your payments
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Adjust funding amount, term length, and rate to preview estimated payments.
              </p>
              <a
                href="/calculator"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary px-8 py-4 text-base font-semibold transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Open the calculator
              </a>
            </Reveal>
            <Reveal delay={150}>
              <CalcMock />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── G) GRADIENT BAND ───────────────────────────────────────────── */}
      <GradientBand
        heading="Ready to see your options?"
        ctaLabel="Apply now — it takes minutes"
        ctaHref="https://app.my-business-solutions.com/apply"
      />
    </Layout>
  );
}

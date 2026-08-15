import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { GradientBand } from "@/components/motion/GradientBand";
import { SectionNumeral } from "@/components/motion/SectionNumeral";
import { NoiseOverlay } from "@/components/motion/NoiseOverlay";
import { AmbientVideo } from "@/components/AmbientVideo";
import { calcPayment } from "@/lib/calcMath";

const APPLY_URL = "https://app.my-business-solutions.com/apply";

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

// ── Live Match Panel ──────────────────────────────────────────────────────────
const CARD_LABELS = ["TERM LOAN", "LINE OF CREDIT", "REVENUE-BASED"] as const;
const BASE_ROTATIONS = [-1, 0.5, -0.5];
const BASE_TRANSLATES = [4, 0, -4];
const AMOUNTS_BY_CARD = [
  [75_000, 50_000, 100_000, 125_000, 90_000],
  [120_000, 80_000, 150_000, 60_000, 200_000],
  [45_000, 30_000, 60_000, 35_000, 55_000],
];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function HeroMockPanel() {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);
  const cycleRef = useRef(0);
  const amtIdxRef = useRef([0, 0, 0]);

  const [amounts, setAmounts] = useState([
    AMOUNTS_BY_CARD[0][0],
    AMOUNTS_BY_CARD[1][0],
    AMOUNTS_BY_CARD[2][0],
  ]);
  const [rollingIdx, setRollingIdx] = useState<number | null>(null);
  const [pillPopIdx, setPillPopIdx] = useState<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const obs = new IntersectionObserver(
      ([e]) => { isVisible.current = e.isIntersecting; },
      { threshold: 0.1 },
    );
    if (panelRef.current) obs.observe(panelRef.current);

    let t1 = 0, t2 = 0;

    const iv = setInterval(() => {
      if (!isVisible.current) return;

      const cardIdx = cycleRef.current;
      cycleRef.current = (cardIdx + 1) % 3;
      amtIdxRef.current[cardIdx] =
        (amtIdxRef.current[cardIdx] + 1) % AMOUNTS_BY_CARD[cardIdx].length;
      const newAmt = AMOUNTS_BY_CARD[cardIdx][amtIdxRef.current[cardIdx]];

      // Phase 1: fade out the amount text
      setRollingIdx(cardIdx);

      // Phase 2: swap value + clear rolling (digit-roll-in fires via key change)
      t1 = window.setTimeout(() => {
        setAmounts((prev) => {
          const n = [...prev];
          n[cardIdx] = newAmt;
          return n;
        });
        setRollingIdx(null);
        setPillPopIdx(cardIdx);
      }, 300);

      // Phase 3: clear pill pop
      t2 = window.setTimeout(() => {
        setPillPopIdx(null);
      }, 900);
    }, 6000);

    return () => {
      clearInterval(iv);
      clearTimeout(t1);
      clearTimeout(t2);
      obs.disconnect();
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={panelRef}
      className="relative flex flex-col justify-center px-8 py-10 min-h-[360px] overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1F4E79 0%, #0E2A47 100%)",
        borderRadius: "12px",
      }}
    >
      <NoiseOverlay opacity={0.04} />

      <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
        Funding options
      </p>

      <div className="relative z-10 flex flex-col gap-4">
        {CARD_LABELS.map((label, i) => (
          <div
            key={label}
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 flex items-center justify-between"
            style={{
              transform: `rotate(${BASE_ROTATIONS[i]}deg) translateX(${BASE_TRANSLATES[i]}px)`,
              transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <div>
              <p className="text-[11px] font-mono font-semibold text-white/50 tracking-widest mb-1">
                {label}
              </p>
              {/* key change on amount triggers digit-roll-in animation */}
              <p
                key={amounts[i]}
                className={`tabular-nums text-white font-heading font-bold text-2xl${!shouldReduceMotion ? " digit-roll" : ""}`}
                style={{
                  opacity: rollingIdx === i ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                {fmt(amounts[i])}
              </p>
            </div>

            {/* Pill springs back to position on each cycle */}
            <motion.span
              animate={{
                scale: pillPopIdx === i ? [1, 1.18, 1] : 1,
              }}
              transition={{ duration: 0.45, times: [0, 0.4, 1] }}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: "#17A567" }}
            >
              Matched
            </motion.span>
          </div>
        ))}
      </div>

      <p className="relative z-10 text-[11px] text-white/30 mt-6 text-right">
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

// ── Industry Marquee ──────────────────────────────────────────────────────────
const INDUSTRIES = [
  "Restaurants",
  "Contractors",
  "Retail",
  "Trucking",
  "Medical",
  "Salons",
  "Auto Repair",
  "E-commerce",
  "Manufacturing",
  "Hospitality",
];

function IndustryMarquee() {
  return (
    <div
      className="mbs-marquee-wrap overflow-hidden py-4 border-y border-border"
      style={{ backgroundColor: "#F5F8FB" }}
      aria-hidden="true"
    >
      <div className="mbs-marquee-track flex whitespace-nowrap">
        {/* Duplicated track for seamless infinite loop */}
        {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5">
            <span
              className="font-sans font-medium text-xs uppercase tracking-[0.1em]"
              style={{ color: "#46586C" }}
            >
              {name}
            </span>
            <span
              className="text-base leading-none"
              style={{ color: "#17A567" }}
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

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

// ── Working Mini-Calculator ───────────────────────────────────────────────────
const MINI_MIN = 10_000;
const MINI_MAX = 500_000;
const MINI_STEP = 5_000;

function MiniCalc() {
  const [amount, setAmount] = useState(100_000);
  const pct = ((amount - MINI_MIN) / (MINI_MAX - MINI_MIN)) * 100;
  const { payment } = calcPayment(amount, 12, 24, "Monthly");

  return (
    <div
      className="bg-white border border-border shadow-lg p-7"
      style={{ borderRadius: "12px" }}
    >
      <p className="font-heading font-semibold text-foreground mb-1">
        Payment estimator
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        12-month term · 24% APR · Monthly payments
      </p>

      {/* Amount slider */}
      <div className="mb-1">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground font-medium">Funding amount</span>
          <span className="tabular-nums font-semibold text-foreground">
            ${amount.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={MINI_MIN}
          max={MINI_MAX}
          step={MINI_STEP}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="calc-slider w-full"
          style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
          aria-label="Funding amount"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 mb-6">
          <span>$10K</span>
          <span>$500K</span>
        </div>
      </div>

      {/* Live result */}
      <div
        className="rounded-xl px-5 py-4"
        style={{ backgroundColor: "#F5F8FB" }}
      >
        <p className="text-sm text-muted-foreground mb-1">Est. monthly payment</p>
        <p
          className="tabular-nums font-heading font-bold text-3xl transition-all duration-150"
          style={{ color: "#1F4E79" }}
        >
          ${payment.toLocaleString()}
        </p>
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed mt-3 mb-5">
        Illustrative only. Actual terms, rates, and payments vary by lender,
        credit profile, and product type.
      </p>

      <div className="flex flex-col gap-3">
        <a
          href="/calculator"
          className="text-sm font-semibold inline-flex items-center gap-1 transition-colors hover:underline"
          style={{ color: "#1F4E79" }}
        >
          Fine-tune in the full calculator
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full text-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{ backgroundColor: "#17A567" }}
        >
          Apply now — it's free
        </a>
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
      <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center bg-background pt-8 pb-16 md:pb-24">
        {/* Radial mesh gradient behind copy side */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(23,165,103,0.055) 0%, transparent 65%), " +
              "radial-gradient(ellipse 45% 55% at 10% 20%, rgba(31,78,121,0.07) 0%, transparent 55%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
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
                  href={APPLY_URL}
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

      {/* ── A½) AMBIENT VIDEO BAND ─────────────────────────────────────── */}
      <AmbientVideo
        heading="Funding that moves as fast as your business"
        body="One application. Multiple lenders. Real offers in 24 hours."
      />

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

      {/* ── C½) INDUSTRY MARQUEE ───────────────────────────────────────── */}
      <IndustryMarquee />

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

          {/* Desktop: horizontal timeline with editorial numerals */}
          <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
            <div
              className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px"
              style={{ backgroundColor: "#DCE4EC" }}
            />
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="relative overflow-hidden flex flex-col items-center text-center px-4 py-2">
                  <SectionNumeral num={step.num} />
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg mb-6 bg-white border-2 tabular-nums"
                      style={{ borderColor: "#17A567", color: "#17A567" }}
                    >
                      {step.num}
                    </div>
                    <SectionIcon
                      slug={step.icon}
                      alt={step.title}
                      className="w-10 h-10 mb-4 object-contain"
                    />
                    <h3 className="font-heading font-semibold text-base text-foreground mb-3">
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

          {/* Mobile: vertical list */}
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
                    <SectionIcon
                      slug={step.icon}
                      alt={step.title}
                      className="w-8 h-8 mb-2 object-contain"
                    />
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

      {/* ── E) BENTO WHY-US ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Why choose us" heading="Why businesses choose us" />
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4">
            {/* ── Navy stats cell (spans 2 rows on desktop, full-width on mobile) */}
            <Reveal delay={0}>
              <div
                className="col-span-2 lg:col-span-1 lg:row-span-2 rounded-[12px] p-8 flex flex-col justify-center h-full"
                style={{ backgroundColor: "#1F4E79" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-8"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  By the numbers
                </p>

                {/* Mobile: 3-across; desktop: vertical stack */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8">
                  {[
                    { value: "6", label: "funding products" },
                    { value: "1", label: "application" },
                    { value: "24hr", label: "typical response" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center lg:text-left">
                      <p className="font-heading font-bold text-3xl lg:text-4xl tabular-nums text-white mb-1">
                        <CountUp value={stat.value} />
                      </p>
                      <p
                        className="text-[11px] font-medium uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── 4 why-us cells (cloud bg) */}
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={80 + i * 60}>
                <div
                  className="rounded-[12px] p-6 h-full"
                  style={{ backgroundColor: "#F5F8FB", border: "1px solid #DCE4EC" }}
                >
                  <SectionIcon slug={item.icon} alt={item.title} className="w-10 h-10 mb-4" />
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── F) WORKING MINI-CALCULATOR ─────────────────────────────────── */}
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
                Adjust the funding amount and see your estimated monthly payment
                instantly. Fine-tune further in the full calculator.
              </p>
              <a
                href="/calculator"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary px-8 py-4 text-base font-semibold transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Open the full calculator
              </a>
            </Reveal>
            <Reveal delay={150}>
              <MiniCalc />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── G) GRADIENT BAND ───────────────────────────────────────────── */}
      <GradientBand
        heading="Ready to see your options?"
        ctaLabel="Apply now — it takes minutes"
        ctaHref={APPLY_URL}
      />
    </Layout>
  );
}

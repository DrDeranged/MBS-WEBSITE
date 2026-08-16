import { useState, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { GradientBand } from "@/components/motion/GradientBand";
import { NoiseOverlay } from "@/components/motion/NoiseOverlay";
import { calcPayment, type Frequency } from "@/lib/calcMath";

const APPLY_URL = "https://app.my-business-solutions.com/apply";
const INK = "#0E2A47";
const NAVY = "#1F4E79";
const GREEN = "#17A567";
const CLOUD = "#EAF1F8";

// ── Duotone monogram — two-letter Sora initial in a navy ring w/ green arc ───
function ProductMonogram({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const letters = ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
  return (
    <div className="relative w-16 h-16 flex-none shrink-0" aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="rgba(31,78,121,0.22)" />
        <circle cx="32" cy="32" r="30.5" stroke="#1F4E79" strokeWidth="1.5" />
        {/* Go-green quarter-arc: 12 o'clock → 3 o'clock */}
        <path
          d="M 32 1.5 A 30.5 30.5 0 0 1 62.5 32"
          stroke="#17A567"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-heading font-bold"
        style={{ fontSize: "20px", color: CLOUD }}
      >
        {letters}
      </span>
    </div>
  );
}

// ── SVG diagonal divider — dark→light only (per art direction) ───────────────
// Container bg = "to" color; polygon fills upper-left triangle with "from" color.
// Consistent angle: diagonal runs top-right → bottom-left across all instances.
function DiagonalDivider({
  fromColor,
  toColor,
}: {
  fromColor: string;
  toColor: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: toColor,
        height: "clamp(40px, 4.5vw, 72px)",
        display: "block",
        lineHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Upper-left triangle = fromColor; bottom-right = container toColor */}
        <polygon points="0,0 1440,0 0,72" fill={fromColor} />
      </svg>
    </div>
  );
}

// ── Live Match Panel — glass card over hero video ─────────────────────────────
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
      ([e]) => {
        isVisible.current = e.isIntersecting;
      },
      { threshold: 0.1 },
    );
    if (panelRef.current) obs.observe(panelRef.current);

    let t1 = 0,
      t2 = 0;

    const iv = setInterval(() => {
      if (!isVisible.current) return;

      const cardIdx = cycleRef.current;
      cycleRef.current = (cardIdx + 1) % 3;
      amtIdxRef.current[cardIdx] =
        (amtIdxRef.current[cardIdx] + 1) % AMOUNTS_BY_CARD[cardIdx].length;
      const newAmt = AMOUNTS_BY_CARD[cardIdx][amtIdxRef.current[cardIdx]];

      setRollingIdx(cardIdx);

      t1 = window.setTimeout(() => {
        setAmounts((prev) => {
          const n = [...prev];
          n[cardIdx] = newAmt;
          return n;
        });
        setRollingIdx(null);
        setPillPopIdx(cardIdx);
      }, 300);

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
      className="relative flex flex-col justify-center px-7 py-9 min-h-[340px] overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px",
      }}
    >
      <NoiseOverlay opacity={0.04} />

      <p className="relative z-10 text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.38)" }}>
        Funding options
      </p>

      <div className="relative z-10 flex flex-col gap-4">
        {CARD_LABELS.map((label, i) => (
          <div
            key={label}
            className="backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.13)",
              transform: `rotate(${BASE_ROTATIONS[i]}deg) translateX(${BASE_TRANSLATES[i]}px)`,
              transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <div>
              <p className="text-[11px] font-mono font-semibold tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                {label}
              </p>
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

            <motion.span
              animate={{
                scale: pillPopIdx === i ? [1, 1.22, 0.95, 1] : 1,
                boxShadow: pillPopIdx === i
                  ? ["0 0 0px rgba(23,165,103,0)", "0 0 14px rgba(23,165,103,0.55)", "0 0 6px rgba(23,165,103,0.25)"]
                  : "0 0 0px rgba(23,165,103,0)",
              }}
              transition={{ duration: 0.5, times: [0, 0.35, 0.7, 1] }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #1DB674 0%, #149258 100%)" }}
            >
              {/* tiny check */}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M1 4.5l2.3 2.3 4.7-4.3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Matched
            </motion.span>
          </div>
        ))}
      </div>

      <p className="relative z-10 text-[11px] mt-6 text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
        Illustrative example
      </p>
    </div>
  );
}

// ── Funding Products data (icons removed — monograms replace them) ────────────
const PRODUCTS = [
  {
    title: "Business Term Loan",
    copy: "Competitive rates and extended repayment terms designed to support your cash flow.",
  },
  {
    title: "Business Line of Credit",
    copy: "Flexible access to capital to help manage cash flow and fuel business growth.",
  },
  {
    title: "Revenue-Based Financing",
    copy: "Quick, straightforward funding so you can stay focused on running your business.",
  },
  {
    title: "Equipment Financing",
    copy: "Finance up to 100% of your equipment costs with industry-leading rates and terms.",
  },
  {
    title: "SBA Loan",
    copy: "A range of SBA loan options to help your business achieve long-term growth.",
  },
  {
    title: "Invoice Factoring",
    copy: "Turn outstanding invoices into immediate cash and eliminate long payment delays.",
  },
];

// ── Industry Marquee — ink theme ──────────────────────────────────────────────
const INDUSTRIES = [
  "Restaurants","Contractors","Retail","Trucking","Medical",
  "Salons","Auto Repair","E-commerce","Manufacturing","Hospitality",
];

function IndustryMarquee() {
  return (
    <div
      className="mbs-marquee-wrap overflow-hidden py-5"
      style={{
        backgroundColor: NAVY,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-hidden="true"
    >
      <div className="mbs-marquee-track flex whitespace-nowrap">
        {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5">
            <span
              className="font-sans font-medium text-xs uppercase tracking-[0.1em]"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              {name}
            </span>
            <span style={{ color: GREEN, opacity: 0.45 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── How It Works — ONE pinned section ────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Apply online",
    copy: "Complete a short application with basic business and financial information.",
  },
  {
    num: "02",
    title: "Get matched",
    copy: "Your profile is reviewed and matched with lenders aligned with your business needs.",
  },
  {
    num: "03",
    title: "Compare offers",
    copy: "Review available terms, repayment structures, and funding amounts.",
  },
  {
    num: "04",
    title: "Get funded",
    copy: "Select an offer and receive funds to support your business goals.",
  },
];

function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Scroll progress over the full 220 vh runway (desktop only but harmless on mobile)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Drive active step index from scroll — update state for crossfading numeral
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveStep(Math.min(3, Math.floor(v * 4)));
  });

  // Progress line fill — 0% → 100%
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // ── Per-step motion values (always called in fixed order — hooks rule safe) ──
  // Blend window: 0.08 wide between steps (entry overlaps exit of predecessor)
  // Step 0 starts fully visible; step 3 ends fully visible.
  const opacities = [
    useTransform(scrollYProgress, [0, 0.21, 0.29], [1, 1, 0.25]),
    useTransform(scrollYProgress, [0.17, 0.29, 0.46, 0.54], [0.25, 1, 1, 0.25]),
    useTransform(scrollYProgress, [0.42, 0.54, 0.71, 0.79], [0.25, 1, 1, 0.25]),
    useTransform(scrollYProgress, [0.67, 0.79, 1], [0.25, 1, 1]),
  ];
  const yValues = [
    useTransform(scrollYProgress, [0, 0.21, 0.29], [0, 0, -24]),
    useTransform(scrollYProgress, [0.17, 0.29, 0.46, 0.54], [24, 0, 0, -24]),
    useTransform(scrollYProgress, [0.42, 0.54, 0.71, 0.79], [24, 0, 0, -24]),
    useTransform(scrollYProgress, [0.67, 0.79, 1], [24, 0, 0]),
  ];
  const scaleValues = [
    useTransform(scrollYProgress, [0, 0.21, 0.29], [1, 1, 0.97]),
    useTransform(scrollYProgress, [0.17, 0.29, 0.46, 0.54], [0.97, 1, 1, 0.97]),
    useTransform(scrollYProgress, [0.42, 0.54, 0.71, 0.79], [0.97, 1, 1, 0.97]),
    useTransform(scrollYProgress, [0.67, 0.79, 1], [0.97, 1, 1]),
  ];

  const step = STEPS[activeStep];

  // ── Shared: stacked list for mobile + reduced-motion ─────────────────────
  const stackedList = (
    <div className="py-16 px-6 max-w-6xl mx-auto">
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-12"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        How it works
      </p>
      {STEPS.map((s, i) => (
        <Reveal key={s.num} delay={i * 80}>
          <div className="flex gap-6 mb-12">
            <div
              className="font-heading font-bold tabular-nums flex-none"
              style={{
                fontSize: "56px",
                lineHeight: 0.88,
                color: "rgba(23,165,103,0.18)",
                width: "64px",
              }}
            >
              {s.num}
            </div>
            <div className="pt-1">
              <h3
                className="font-heading font-bold mb-3"
                style={{ fontSize: "clamp(22px, 4vw, 32px)", color: CLOUD }}
              >
                {s.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "rgba(234,241,248,0.52)" }}
              >
                {s.copy}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );

  // ── Reduced-motion: static list at all breakpoints ────────────────────────
  if (shouldReduceMotion) {
    return (
      <section id="how-it-works" style={{ backgroundColor: INK }}>
        {stackedList}
      </section>
    );
  }

  return (
    <section id="how-it-works" ref={sectionRef} style={{ backgroundColor: INK }}>
      {/* ── DESKTOP — 220 vh pinned scroll ─────────────────────────────────── */}
      <div className="hidden md:flex flex-col" style={{ height: "220vh" }}>
        {/* Sticky viewport-height panel */}
        <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
          <div
            className="mx-auto max-w-6xl px-6 h-full grid"
            style={{ gridTemplateColumns: "260px 1fr" }}
          >
            {/* LEFT — label · progress line · numeral · step title */}
            <div className="flex flex-col justify-center py-12 pr-8">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-8"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                How it works
              </p>

              {/* Continuous progress line */}
              <div
                className="relative mb-8"
                style={{
                  width: "1px",
                  height: "100px",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: lineHeight,
                    background: GREEN,
                  }}
                />
              </div>

              {/* Numeral — crossfades with each step */}
              <div
                style={{
                  position: "relative",
                  height: "clamp(96px, 11vw, 152px)",
                  overflow: "hidden",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.24, ease: "easeInOut" }}
                    className="absolute inset-0 font-heading font-bold tabular-nums"
                    style={{
                      fontSize: "clamp(96px, 11vw, 152px)",
                      lineHeight: 0.88,
                      color: "rgba(23,165,103,0.14)",
                    }}
                  >
                    {step.num}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 w-10 h-px" style={{ backgroundColor: GREEN }} />

              {/* Step title label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading font-semibold text-sm mt-4 max-w-[200px]"
                  style={{ color: CLOUD }}
                >
                  {step.title}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* RIGHT — scroll-driven step panels (all absolutely stacked) */}
            <div
              className="relative border-l"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: "56px",
                    paddingRight: "32px",
                    opacity: opacities[i],
                    y: yValues[i],
                    scale: scaleValues[i],
                  }}
                >
                  <h3
                    className="font-heading font-bold mb-5 leading-tight"
                    style={{
                      fontSize: "clamp(28px, 4vw, 48px)",
                      color: CLOUD,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-lg leading-relaxed max-w-lg"
                    style={{ color: "rgba(234,241,248,0.52)" }}
                  >
                    {s.copy}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE — plain stacked steps, no pin ───────────────────────────── */}
      <div className="md:hidden">{stackedList}</div>
    </section>
  );
}

// ── Why Us data (icons removed — green square markers replace them) ───────────
const WHY_US = [
  {
    title: "One application",
    copy: "Complete a single application and unlock access to multiple lenders and funding products at once.",
  },
  {
    title: "Multiple options",
    copy: "We match you with a range of financing solutions tailored to your business profile and goals.",
  },
  {
    title: "Fast decisions",
    copy: "Receive matched funding options typically within 24 hours of completing your application.",
  },
  {
    title: "Dedicated support",
    copy: "Our team is here to guide you through the process and help you choose the right offer.",
  },
];

// ── Working Mini-Calculator (light contrast moment) ───────────────────────────
const MINI_MIN = 10_000;
const MINI_MAX = 500_000;
const MINI_STEP = 5_000;
const MINI_FREQ_OPTIONS: Frequency[] = ["Monthly", "Bi-weekly", "Weekly"];

function MiniCalc() {
  const [amount, setAmount] = useState(100_000);
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const pct = ((amount - MINI_MIN) / (MINI_MAX - MINI_MIN)) * 100;
  const { payment } = calcPayment(amount, 12, 24, frequency);

  return (
    <div
      className="bg-white border border-border shadow-lg p-7"
      style={{ borderRadius: "12px" }}
    >
      <p className="font-heading font-semibold text-foreground mb-1">
        Payment estimator
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        12-month term · 24% APR
      </p>

      {/* Frequency toggle */}
      <div
        className="flex gap-1 p-1 rounded-lg mb-6"
        style={{ backgroundColor: "#F5F8FB" }}
        role="group"
        aria-label="Payment frequency"
      >
        {MINI_FREQ_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFrequency(f)}
            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all duration-150 ${
              frequency === f
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

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
      <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#F5F8FB" }}>
        <p className="text-sm text-muted-foreground mb-1">
          Est. {frequency.toLowerCase()} payment
        </p>
        <p
          className="tabular-nums font-heading font-bold text-3xl transition-all duration-150"
          style={{ color: NAVY }}
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
          style={{ color: NAVY }}
        >
          Fine-tune in the full calculator
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm"
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

  // Hero video playback (replicates AmbientVideo logic; don't modify AmbientVideo.tsx)
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      video.pause();
    } else {
      video.play().catch(() => {
        video.addEventListener("canplay", () => video.play().catch(() => {}), {
          once: true,
        });
      });
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) video.pause();
      else video.play().catch(() => {});
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Layout mainClassName="flex-1">
      {/* ── A) CINEMATIC HERO ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ minHeight: "100dvh", paddingTop: "96px", paddingBottom: "72px" }}
      >
        {/* Full-bleed video background */}
        <video
          ref={heroVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster="/videos/hero-band-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/hero-band.webm" type="video/webm" />
          <source src="/videos/hero-band.mp4" type="video/mp4" />
        </video>

        {/* Ink gradient overlay — 85 % left (copy) → 40 % right (glass panel) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(14,42,71,0.88) 0%, rgba(14,42,71,0.42) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
          <div className="grid md:grid-cols-2 xl:grid-cols-[44%_56%] gap-12 lg:gap-16 items-center">
            {/* ── Left: copy ─────────────────────────────────────────────── */}
            <Reveal delay={0}>
              <h1
                className="font-heading font-bold tracking-tight mb-5"
                style={{
                  fontSize: "clamp(44px, 6vw, 88px)",
                  lineHeight: 1.02,
                  color: CLOUD,
                }}
              >
                Smart business funding,{" "}
                <span className="relative inline-block whitespace-nowrap" style={{ color: GREEN }}>
                  simplified
                  {/* Animated drawn underline */}
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 260 10"
                    preserveAspectRatio="none"
                    className="absolute left-0 w-full pointer-events-none overflow-visible"
                    style={{ bottom: "-0.08em", height: "0.17em" }}
                  >
                    <path
                      d="M3,6 C55,2 110,9 165,5 C210,2 240,7 257,5"
                      fill="none"
                      stroke="#17A567"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="mbs-underline-draw"
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="font-heading font-semibold text-xl md:text-2xl mb-6"
                style={{ color: "rgba(234,241,248,0.75)" }}
              >
                Get matched with the right financing
              </p>
              <p
                className="text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: "rgba(234,241,248,0.60)" }}
              >
                Apply once and access multiple business funding options tailored
                to your company's needs. Compare offers, choose confidently, and
                move forward faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8"
                >
                  Check your options
                </a>
                <a
                  href="#how-it-works"
                  className="btn-ghost text-base px-8"
                >
                  How it works
                </a>
              </div>
            </Reveal>

            {/* ── Right: glass match panel ───────────────────────────────── */}
            <Reveal delay={150} className="xl:-mr-10">
              <HeroMockPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── B) TRUST STRIP (dark) ──────────────────────────────────────────── */}
      <section
        className="py-12"
        style={{
          backgroundColor: NAVY,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-3 gap-6 sm:gap-8 divide-x divide-white/10">
            {[
              { value: "6", label: "funding products" },
              { value: "1", label: "application" },
              { value: "24hr", label: "typical response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 sm:px-8">
                <p className="font-heading font-bold text-3xl md:text-4xl tabular-nums text-white mb-1">
                  <CountUp value={stat.value} />
                </p>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── C) FUNDING PRODUCTS — editorial 2-column list ─────────────────── */}
      <section id="products" className="py-20 md:py-28" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: GREEN }}
            >
              Funding solutions
            </p>
            <h2
              className="font-heading font-bold text-3xl md:text-4xl mb-14 leading-tight"
              style={{ color: CLOUD }}
            >
              Flexible financing for every stage
            </h2>
          </Reveal>

          {/* 2-column offset list: left column gets items 0,2,4; right gets 1,3,5 */}
          <div className="grid md:grid-cols-2 gap-x-16">
            {[0, 1].map((col) => (
              <div key={col}>
                {PRODUCTS.filter((_, i) => i % 2 === col).map((p, rowIdx) => (
                  <Reveal key={p.title} delay={rowIdx * 80 + col * 40}>
                    <div
                      className="group relative flex items-center gap-6 py-7 overflow-hidden cursor-pointer"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {/* Hover green wipe — slides in from left */}
                      <div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none"
                        style={{ backgroundColor: "rgba(23,165,103,0.07)" }}
                      />
                      <ProductMonogram title={p.title} />
                      <div className="relative z-10 flex-1 min-w-0">
                        <h3
                          className="font-heading font-semibold text-base mb-1.5 transition-colors duration-300 group-hover:text-[#17A567]"
                          style={{ color: CLOUD }}
                        >
                          {p.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "rgba(234,241,248,0.48)" }}
                        >
                          {p.copy}
                        </p>
                      </div>
                      {/* Arrow appears on hover */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="relative z-10 flex-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: GREEN }}
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>

          <Reveal delay={240}>
            <div className="mt-14 text-center">
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(23,165,103,0.40)]"
                style={{ backgroundColor: GREEN }}
              >
                See your funding options
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── C½) INDUSTRY MARQUEE — ink theme ──────────────────────────────── */}
      <IndustryMarquee />

      {/* ── D) HOW IT WORKS — pinned scroll (one pinned section, per spec) ── */}
      <HowItWorksSection />

      {/* ── E) BENTO WHY-US — ink theme, green square markers ─────────────── */}
      <section className="py-24 md:py-32" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: GREEN }}
            >
              Why choose us
            </p>
            <h2
              className="font-heading font-bold text-3xl md:text-4xl mb-14 leading-tight"
              style={{ color: CLOUD }}
            >
              Why businesses choose us
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3">
            {/* Stats cell — spans 2 rows on desktop */}
            <Reveal delay={0}>
              <div
                className="col-span-2 lg:col-span-1 lg:row-span-2 rounded-2xl p-8 flex flex-col justify-center h-full"
                style={{ backgroundColor: NAVY }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-8"
                  style={{ color: "rgba(255,255,255,0.33)" }}
                >
                  By the numbers
                </p>
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
                        style={{ color: "rgba(255,255,255,0.42)" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* 4 why-us cells — go-green square marker */}
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={80 + i * 60}>
                <div
                  className="rounded-2xl p-6 h-full"
                  style={{
                    backgroundColor: "rgba(31,78,121,0.20)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Go-green square marker */}
                  <div
                    className="mb-5"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: GREEN,
                      borderRadius: "2px",
                    }}
                  />
                  <h3
                    className="font-heading font-semibold text-base mb-2"
                    style={{ color: CLOUD }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(234,241,248,0.50)" }}
                  >
                    {item.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diagonal divider: dark → light (the only dark→light seam) ─────── */}
      <DiagonalDivider fromColor={INK} toColor="#ffffff" />

      {/* ── F) MINI-CALC — light paper section (deliberate contrast moment) ─ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#ffffff" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={0}>
              <p
                className="font-sans font-semibold text-[12px] uppercase mb-3"
                style={{ letterSpacing: "0.08em", color: GREEN }}
              >
                Payment calculator
              </p>
              <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-5 leading-tight">
                Estimate your payments
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Adjust the funding amount and see your estimated payment
                instantly. Fine-tune further in the full calculator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(23,165,103,0.40)]"
                  style={{ backgroundColor: GREEN }}
                >
                  Apply now — it's free
                </a>
                <a
                  href="/calculator"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary px-8 py-4 text-base font-semibold transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  Full calculator
                </a>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <MiniCalc />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── G) GRADIENT BAND CTA — flat edge (light→dark, no diagonal per spec) */}
      <GradientBand
        heading="Ready to see your options?"
        ctaLabel="Apply now — it takes minutes"
        ctaHref={APPLY_URL}
      />
    </Layout>
  );
}

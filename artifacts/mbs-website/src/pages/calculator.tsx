import { Layout } from "@/components/layout/layout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { calcPayment, type Frequency } from "@/lib/calcMath";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-US");
}
function fmtDollar(n: number) {
  return "$" + fmt(n);
}

// ── Segmented control ─────────────────────────────────────────────────────────
function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border overflow-hidden bg-muted p-0.5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none ${
            value === o.value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Slider with synced fill ───────────────────────────────────────────────────
function CalcSlider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="calc-slider w-full"
      style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
    />
  );
}

// ── Rate band buttons ─────────────────────────────────────────────────────────
const RATE_BANDS = [
  { apr: 12, label: "Strong credit", est: "est. 12% APR" },
  { apr: 24, label: "Average",       est: "est. 24% APR" },
  { apr: 36, label: "Building",      est: "est. 36% APR" },
] as const;

type RateBand = (typeof RATE_BANDS)[number]["apr"] | null;

function RateBandButtons({
  selected,
  onSelect,
}: {
  selected: RateBand;
  onSelect: (apr: number | null) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {RATE_BANDS.map((b) => {
        const active = selected === b.apr;
        return (
          <button
            key={b.apr}
            type="button"
            onClick={() => onSelect(active ? null : b.apr)}
            className={`rounded-xl border px-3 py-3 text-left transition-all duration-150 focus:outline-none ${
              active
                ? "border-accent bg-accent/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <p
              className={`text-sm font-semibold mb-0.5 transition-colors duration-150 ${
                active ? "text-accent" : "text-foreground"
              }`}
            >
              {b.label}
            </p>
            <p
              className={`text-xs font-medium tabular-nums transition-all duration-200 ${
                active ? "text-accent/80" : "text-muted-foreground"
              }`}
            >
              {b.est}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ── Results card ──────────────────────────────────────────────────────────────
function ResultsCard({
  result,
  principal,
  frequency,
  pulsing,
  animKey,
}: {
  result: ReturnType<typeof calcPayment>;
  principal: number;
  frequency: Frequency;
  pulsing: boolean;
  animKey: number;
}) {
  const principalPct = Math.max(
    0,
    Math.min(100, Math.round((principal / result.totalRepayment) * 100)),
  );

  return (
    <div
      className={`bg-white border rounded-[16px] p-7 shadow-[0_4px_24px_rgba(14,42,71,0.08)] ${
        pulsing ? "results-pulse" : ""
      }`}
      style={{ borderColor: pulsing ? "#17A567" : undefined }}
    >
      {/* Big payment */}
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Estimated {frequency.toLowerCase()} payment
      </p>
      <p
        key={animKey}
        className="digit-roll tabular-nums font-heading font-bold leading-none mb-6"
        style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", color: "#1F4E79" }}
      >
        {fmtDollar(result.payment)}
      </p>

      {/* Secondary rows */}
      {[
        { label: "Total repayment",      value: fmtDollar(result.totalRepayment) },
        { label: "Total cost of capital", value: fmtDollar(result.totalCost) },
        { label: "Number of payments",   value: fmt(result.numPeriods) },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between py-3 border-t border-border"
        >
          <span className="text-sm text-muted-foreground">{row.label}</span>
          <span className="tabular-nums text-sm font-semibold text-foreground">
            {row.value}
          </span>
        </div>
      ))}

      {/* Principal vs cost bar */}
      <div className="mt-5 mb-1">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Principal ({principalPct}%)</span>
          <span>Cost of capital ({100 - principalPct}%)</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-muted flex">
          <div
            className="h-full rounded-l-full transition-all duration-500"
            style={{ width: `${principalPct}%`, backgroundColor: "#1F4E79" }}
          />
          <div
            className="h-full rounded-r-full transition-all duration-500"
            style={{ width: `${100 - principalPct}%`, backgroundColor: "#DCE4EC" }}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[12px] leading-relaxed mt-5 mb-6" style={{ color: "#46586C" }}>
        Estimates are for illustration only and do not constitute an offer, quote, or
        guarantee of financing. Actual terms depend on underwriting and lender programs.
      </p>

      {/* CTA */}
      <a
        href="https://app.my-business-solutions.com/apply"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-full text-white px-6 py-4 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{ backgroundColor: "#17A567" }}
      >
        Get your real offer →
      </a>
    </div>
  );
}

// ── Mobile bottom summary bar ─────────────────────────────────────────────────
function MobileBar({
  result,
  frequency,
  animKey,
}: {
  result: ReturnType<typeof calcPayment>;
  frequency: Frequency;
  animKey: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-4px_16px_rgba(14,42,71,0.08)]"
      style={{ borderRadius: "16px 16px 0 0" }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-label="Toggle payment summary"
      >
        <div className="text-left">
          <p className="text-xs text-muted-foreground">
            Est. {frequency.toLowerCase()} payment
          </p>
          <p
            key={animKey}
            className="digit-roll tabular-nums font-heading font-bold text-2xl"
            style={{ color: "#1F4E79" }}
          >
            {fmtDollar(result.payment)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://app.my-business-solutions.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full text-white px-5 py-2.5 text-sm font-semibold"
            style={{ backgroundColor: "#17A567" }}
          >
            Apply
          </a>
          <svg
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          {[
            { label: "Total repayment",      value: fmtDollar(result.totalRepayment) },
            { label: "Total cost of capital", value: fmtDollar(result.totalCost) },
            { label: "Number of payments",   value: fmt(result.numPeriods) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="tabular-nums text-sm font-semibold text-foreground">
                {row.value}
              </span>
            </div>
          ))}
          <p className="text-[11px] mt-3" style={{ color: "#46586C" }}>
            Estimates are for illustration only and do not constitute an offer, quote, or
            guarantee of financing. Actual terms depend on underwriting and lender programs.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Control block wrapper ─────────────────────────────────────────────────────
function ControlBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white border border-border rounded-[12px] p-6 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const FREQ_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "Monthly",   label: "Monthly"   },
  { value: "Bi-weekly", label: "Bi-weekly" },
  { value: "Weekly",    label: "Weekly"    },
  { value: "Daily",     label: "Daily"     },
];

const DEFAULT_BAND_APR = 24;

export default function Calculator() {
  usePageMeta(
    "Business Funding Calculator | My Business Solutions",
    "Estimate your business loan payments with our free calculator. Adjust funding amount, term, and rate to preview monthly, weekly, or daily payments.",
  );

  // ── Control state ───────────────────────────────────────────────────────────
  const [principal, setPrincipal]       = useState(75_000);
  const [inputVal, setInputVal]         = useState("75000");
  const [termMonths, setTermMonths]     = useState(12);
  const [rateBand, setRateBand]         = useState<RateBand>(DEFAULT_BAND_APR);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedApr, setAdvancedApr]   = useState(24);
  const [frequency, setFrequency]       = useState<Frequency>("Monthly");

  const effectiveApr = rateBand !== null ? rateBand : advancedApr;

  // ── Sync principal ↔ input ──────────────────────────────────────────────────
  const handlePrincipalSlider = useCallback((v: number) => {
    setPrincipal(v);
    setInputVal(String(v));
  }, []);

  const handleInputChange = useCallback((raw: string) => {
    setInputVal(raw);
    const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n) && n >= 10_000 && n <= 500_000) {
      // Snap to nearest $5 000 step
      setPrincipal(Math.round(n / 5_000) * 5_000);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputVal(String(principal));
  }, [principal]);

  // ── Results ─────────────────────────────────────────────────────────────────
  const result = useMemo(
    () => calcPayment(principal, termMonths, effectiveApr, frequency),
    [principal, termMonths, effectiveApr, frequency],
  );

  // Pulse + digit-roll animation key
  const [pulsing, setPulsing]   = useState(false);
  const [animKey, setAnimKey]   = useState(0);
  const prevPayment             = useRef<number | null>(null);

  useEffect(() => {
    if (prevPayment.current !== null && prevPayment.current !== result.payment) {
      setPulsing(false);
      requestAnimationFrame(() => {
        setPulsing(true);
        setAnimKey((k) => k + 1);
        setTimeout(() => setPulsing(false), 600);
      });
    }
    prevPayment.current = result.payment;
  }, [result.payment]);

  // Handle rate band / advanced toggle
  const handleBandSelect = (apr: number | null) => {
    setRateBand(apr as RateBand);
    if (apr !== null) setShowAdvanced(false);
  };
  const handleAdvancedToggle = () => {
    setShowAdvanced((s) => {
      if (!s) setRateBand(null);
      return !s;
    });
  };

  return (
    <Layout>
      {/* Page header — dark, ink-first shell */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ background: "linear-gradient(160deg, #0E2A47 0%, #1F4E79 100%)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <p
            className="font-sans font-semibold text-[12px] uppercase mb-4 tracking-widest"
            style={{ color: "#17A567" }}
          >
            Payment estimator
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight mb-4">
            Estimate your payments
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
            Adjust the numbers to preview estimated payments — then get your
            real offer in minutes.
          </p>
        </div>
      </section>

      {/* Two-column working area */}
      <section
        style={{ backgroundColor: "#F5F8FB" }}
        className="py-12 pb-32 lg:pb-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── LEFT: Controls ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Funding amount */}
              <ControlBlock label="Funding amount">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={inputVal}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={handleInputBlur}
                      className="w-32 pl-7 pr-3 py-2 rounded-lg border border-border text-sm font-semibold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <CalcSlider
                  min={10_000}
                  max={500_000}
                  step={5_000}
                  value={principal}
                  onChange={handlePrincipalSlider}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 tabular-nums">
                  <span>$10,000</span>
                  <span>$500,000</span>
                </div>
              </ControlBlock>

              {/* Term length */}
              <ControlBlock label="Term length">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="tabular-nums text-sm font-semibold text-foreground">
                    {termMonths} {termMonths === 1 ? "month" : "months"}
                  </span>
                </div>
                <CalcSlider
                  min={3}
                  max={60}
                  step={1}
                  value={termMonths}
                  onChange={setTermMonths}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 tabular-nums">
                  <span>3 months</span>
                  <span>60 months</span>
                </div>
              </ControlBlock>

              {/* Estimated rate */}
              <ControlBlock label="Estimated rate">
                <RateBandButtons selected={rateBand} onSelect={handleBandSelect} />
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAdvancedToggle}
                    className={`text-xs font-semibold transition-colors duration-150 focus:outline-none underline underline-offset-2 ${
                      showAdvanced ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {showAdvanced ? "Hide" : "Enter"} exact APR
                  </button>
                  {showAdvanced && (
                    <span className="text-xs text-muted-foreground">(8–60%)</span>
                  )}
                </div>
                {showAdvanced && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">APR</span>
                      <span className="tabular-nums text-sm font-semibold text-foreground">
                        {advancedApr}%
                      </span>
                    </div>
                    <CalcSlider
                      min={8}
                      max={60}
                      step={0.5}
                      value={advancedApr}
                      onChange={setAdvancedApr}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 tabular-nums">
                      <span>8%</span>
                      <span>60%</span>
                    </div>
                  </div>
                )}
              </ControlBlock>

              {/* Payment frequency */}
              <ControlBlock label="Payment frequency">
                <Segmented
                  options={FREQ_OPTIONS}
                  value={frequency}
                  onChange={(v) => setFrequency(v as Frequency)}
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Bi-weekly uses 26 periods/year; Weekly 52; Daily 252 business days.
                </p>
              </ControlBlock>
            </div>

            {/* ── RIGHT: Results (sticky desktop) ────────────────────────── */}
            <div className="hidden lg:block sticky top-24">
              <ResultsCard
                result={result}
                principal={principal}
                frequency={frequency}
                pulsing={pulsing}
                animKey={animKey}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile bottom-pinned bar */}
      <MobileBar result={result} frequency={frequency} animKey={animKey} />
    </Layout>
  );
}

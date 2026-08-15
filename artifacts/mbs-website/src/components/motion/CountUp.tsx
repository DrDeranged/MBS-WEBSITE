import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  /** Full value string, e.g. "6", "24hr", "$5M+". Numeric part animates; prefix/suffix render static. */
  value: string;
  className?: string;
}

function parseValue(value: string) {
  // Match optional non-digit prefix, then number, then optional non-digit suffix
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: value };
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export function CountUp({ value, className = "" }: CountUpProps) {
  const { prefix, num, suffix } = parseValue(value);
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrent(num);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          observer.disconnect();
          const duration = 700;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // cubic ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * num));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, prefersReducedMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

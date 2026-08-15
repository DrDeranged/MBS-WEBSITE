import { useRef, useEffect, useState, CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the transition starts (for stagger). */
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
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
          setVisible(true);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const style: CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

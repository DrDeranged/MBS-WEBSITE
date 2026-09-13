import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";

const LazyMbsAssist = lazy(() =>
  import("@/components/MbsAssist").then((module) => ({ default: module.MbsAssist })),
);

export function MbsAssistLauncher() {
  const prefersReducedMotion = useReducedMotion();
  const [location] = useLocation();
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <Suspense fallback={null}>
        <LazyMbsAssist initialOpen />
      </Suspense>
    );
  }

  return (
    <motion.button
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { delay: 0.4, type: "spring", stiffness: 380, damping: 26 }
      }
      whileHover={prefersReducedMotion ? {} : { y: -3 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
      onClick={() => setLoaded(true)}
      aria-label="Ask MBS — open chat"
      className={`fixed right-6 z-50 flex items-center gap-2.5 rounded-full px-5 py-3 font-semibold text-sm text-white select-none focus-visible:outline-none ${location === "/calculator" ? "bottom-24" : "bottom-6"}`}
      style={{
        background: "rgba(14,42,71,0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 24px rgba(14,42,71,0.30), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
        <span className="mbs-dot-pulse absolute inline-flex h-full w-full rounded-full bg-[#17A567] opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#17A567]" />
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Ask MBS
    </motion.button>
  );
}
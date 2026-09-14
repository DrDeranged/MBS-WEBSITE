import { type ReactNode, useEffect, useRef, useState } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

type CinematicVideoProps = {
  src: string;
  poster: string;
  children: ReactNode;
  className?: string;
  eager?: boolean;
  overlay?: string;
  ariaLabel: string;
};

export function CinematicVideo({
  src,
  poster,
  children,
  className = "",
  eager = false,
  overlay = "linear-gradient(135deg, rgba(14,42,71,0.88), rgba(14,42,71,0.62))",
  ariaLabel,
}: CinematicVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const [inView, setInView] = useState(eager);
  const [hasEntered, setHasEntered] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setInView(true);
      setHasEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin: "240px 0px", threshold: 0.05 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const playbackBlocked = useAutoplayVideo(videoRef, inView && !reducedMotion);
  const showStaticGradient = reducedMotion || playbackBlocked;

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
      style={{
        background:
          "linear-gradient(135deg, #0E2A47 0%, #1F4E79 58%, #123D5F 100%)",
      }}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover ${showStaticGradient ? "invisible" : ""}`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? "metadata" : "none"}
        aria-hidden="true"
      >
        {hasEntered && !reducedMotion && <source src={src} type="video/mp4" />}
      </video>
      <div className="absolute inset-0" style={{ background: overlay }} aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
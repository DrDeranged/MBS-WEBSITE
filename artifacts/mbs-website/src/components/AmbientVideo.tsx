import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

interface AmbientVideoProps {
  /** Heading overlaid on the band */
  heading?: string;
  /** Body copy overlaid on the band */
  body?: string;
  /** Height of the band (Tailwind class) — defaults to a fixed viewport slice */
  className?: string;
}

/**
 * Full-bleed ambient video band.
 * Serves WebM to capable browsers, MP4 as fallback.
 * Autoplay · muted · loop · playsInline · no controls.
 * Shows the poster immediately so there's no flash on slow connections.
 * Respects prefers-reduced-motion: video is paused, poster shown.
 */
export function AmbientVideo({
  heading,
  body,
  className = "",
}: AmbientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useAutoplayVideo(videoRef);

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: "clamp(300px, 45vh, 560px)" }}
      aria-label="Ambient background video"
    >
      {/* Video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster="/videos/hero-band-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/hero-band.webm" type="video/webm" />
        <source src="/videos/hero-band.mp4"  type="video/mp4" />
      </video>

      {/* Navy gradient overlay — darkens video, keeps text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,42,71,0.72) 0%, rgba(31,78,121,0.55) 100%)",
        }}
      />

      {/* Optional text content */}
      {(heading || body) && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-16 text-center">
          {heading && (
            <h2 className="font-heading font-bold text-white text-3xl md:text-5xl leading-tight mb-4 max-w-3xl">
              {heading}
            </h2>
          )}
          {body && (
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">{body}</p>
          )}
        </div>
      )}
    </section>
  );
}

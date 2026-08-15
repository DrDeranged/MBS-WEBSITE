import { useId } from "react";

interface NoiseOverlayProps {
  /** 0–1 opacity. Defaults to 0.035. */
  opacity?: number;
  className?: string;
}

/**
 * Absolutely-positioned SVG feTurbulence noise overlay.
 * Place inside a `position:relative overflow-hidden` parent.
 * Purely decorative — aria-hidden, pointer-events-none.
 */
export function NoiseOverlay({ opacity = 0.035, className = "" }: NoiseOverlayProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `mbs-n-${uid}`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{ opacity, zIndex: 0, transform: "translateZ(0)" }}
    >
      <defs>
        <filter
          id={filterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}

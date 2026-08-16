import { NoiseOverlay } from "@/components/motion/NoiseOverlay";

interface GradientBandProps {
  heading: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Full-bleed navy→ink diagonal gradient band with white heading and go-green pill CTA. */
export function GradientBand({ heading, ctaLabel, ctaHref }: GradientBandProps) {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(135deg, #1F4E79 0%, #0E2A47 100%)",
      }}
    >
      {/* Noise texture */}
      <NoiseOverlay opacity={0.05} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-10 leading-tight">
          {heading}
        </h2>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-lg px-8"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

interface GradientBandProps {
  heading: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Full-bleed navy→ink diagonal gradient band with white heading and go-green pill CTA. */
export function GradientBand({ heading, ctaLabel, ctaHref }: GradientBandProps) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1F4E79 0%, #0E2A47 100%)",
      }}
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-10 leading-tight">
          {heading}
        </h2>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-accent text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

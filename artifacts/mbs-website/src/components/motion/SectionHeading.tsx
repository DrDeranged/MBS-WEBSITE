interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subcopy?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subcopy,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass} mb-12 ${className}`}>
      <p
        style={{ letterSpacing: "0.08em" }}
        className="font-sans font-semibold text-[12px] uppercase text-accent mb-3"
      >
        {eyebrow}
      </p>
      <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-4 leading-tight">
        {heading}
      </h2>
      {subcopy && (
        <p className="text-muted-foreground text-lg leading-relaxed">{subcopy}</p>
      )}
    </div>
  );
}

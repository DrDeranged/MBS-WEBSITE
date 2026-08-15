/**
 * Oversized editorial step numeral — Sora, go-green at 8% opacity, clipped
 * behind each step's content. Use inside a `position:relative overflow-hidden`
 * container; the numeral fills the parent via `absolute inset-0`.
 */
export function SectionNumeral({ num }: { num: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <span
        className="font-heading font-bold"
        style={{
          fontSize: "clamp(100px, 9vw, 140px)",
          lineHeight: 1,
          color: "#17A567",
          opacity: 0.08,
          letterSpacing: "-0.04em",
        }}
      >
        {num}
      </span>
    </div>
  );
}

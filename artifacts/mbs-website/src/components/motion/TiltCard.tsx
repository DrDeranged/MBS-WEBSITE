import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/** Card that lifts 4px and deepens shadow on hover. 12px radius, 1px line border. */
export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div
      className={`
        bg-card border border-border p-6
        shadow-sm
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(31,78,121,0.12)]
        ${className}
      `}
      style={{ borderRadius: "12px" }}
    >
      {children}
    </div>
  );
}

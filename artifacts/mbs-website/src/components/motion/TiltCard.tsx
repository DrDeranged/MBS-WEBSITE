import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/** Card that lifts 4px and deepens shadow on hover. 12px radius, 1px line border. */
export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div
      className={`bg-card border border-border p-6 mbs-card ${className}`}
    >
      {children}
    </div>
  );
}

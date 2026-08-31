import type { ReactNode } from "react";

interface MonoProps {
  children: ReactNode;
  className?: string;
}

// Small helper for the numeric/date values the mockups render in IBM Plex Mono.
export const Mono = ({ children, className = "" }: MonoProps) => (
  <span
    className={`tabular-nums ${className}`}
    style={{ fontFamily: "var(--joy-fontFamily-code)" }}
  >
    {children}
  </span>
);

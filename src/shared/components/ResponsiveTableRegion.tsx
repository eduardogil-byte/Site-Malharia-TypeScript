import type { ReactNode } from "react";

type ResponsiveTableRegionProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function ResponsiveTableRegion({
  label,
  children,
  className = "",
}: ResponsiveTableRegionProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={[
        "overflow-x-auto overscroll-x-contain outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary";
};

export function Badge({ children, className = "", variant = "default", ...props }: BadgeProps) {
  const variantClass = variant === "secondary"
    ? "bg-slate-100 text-slate-700"
    : `${className.includes("bg-") ? "" : "bg-slate-100"} ${/text-(?!xs|sm|base|lg|xl)[a-z]+-/.test(className) ? "" : "text-slate-700"}`;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

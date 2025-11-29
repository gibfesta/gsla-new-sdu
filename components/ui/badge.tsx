import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary";
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variantClass =
    variant === "secondary"
      ? "bg-slate-100 text-slate-800"
      : "bg-slate-900 text-white";

  return (
    <span className={`${base} ${variantClass} ${className}`} {...props} />
  );
}

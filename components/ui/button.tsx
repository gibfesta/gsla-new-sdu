import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "default" | "sm";
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClass = size === "sm" ? "px-2 py-1" : "px-3 py-2";

  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-300"
      : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400";

  return (
    <button
      className={`${base} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    />
  );
}

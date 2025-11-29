import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={
        "rounded-lg border bg-white shadow-sm p-4 " + className
      }
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return (
    <div
      className={"mb-2 flex items-center justify-between " + className}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }: CardProps) {
  return (
    <h2
      className={
        "text-base font-semibold text-slate-900 " + className
      }
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: CardProps) {
  return (
    <div className={"text-sm text-slate-700 " + className} {...props} />
  );
}

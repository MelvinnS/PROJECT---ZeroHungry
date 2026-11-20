import React from "react";

export type BadgeVariant =
  | "primary"
  | "surface"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-primary-soft text-primary";
      break;
    case "surface":
      variantClasses = "bg-surface text-ink border border-black/[0.06]";
      break;
    case "success":
      variantClasses = "bg-emerald-50 text-emerald-700";
      break;
    case "warning":
      variantClasses = "bg-amber-50 text-amber-700";
      break;
    case "danger":
      variantClasses = "bg-rose-50 text-rose-700";
      break;
    case "outline":
      variantClasses = "border border-black/[0.12] text-muted";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

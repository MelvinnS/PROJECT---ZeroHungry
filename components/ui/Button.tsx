import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "outline" | "white" | "link";
export type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Ukuran dasar dengan touch target minimum 44px untuk aksesibilitas
    const sizeClasses =
      variant === "link"
        ? "p-0 text-sm font-semibold inline-flex items-center min-h-[44px]"
        : size === "lg"
        ? "px-7 py-3.5 text-base font-semibold min-h-[48px]"
        : "px-5 py-2.5 text-sm font-semibold min-h-[44px]";

    // Varian gaya tombol
    let variantClasses = "";
    switch (variant) {
      case "primary":
        variantClasses =
          "bg-primary text-white hover:bg-[#15542d] shadow-sm hover:shadow active:scale-[0.98]";
        break;
      case "outline":
        variantClasses =
          "border border-primary text-primary bg-transparent hover:bg-primary-soft active:scale-[0.98]";
        break;
      case "white":
        variantClasses =
          "bg-white text-primary hover:bg-zinc-100 shadow-sm hover:shadow active:scale-[0.98]";
        break;
      case "link":
        variantClasses =
          "text-primary hover:text-[#15542d] underline-offset-4 hover:underline";
        break;
    }

    const baseClasses =
      variant === "link"
        ? "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        : `inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none ${
            fullWidth ? "w-full" : ""
          }`;

    const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`.trim();

    if (href) {
      return (
        <Link
          href={href}
          className={combinedClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-disabled={disabled}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClasses}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

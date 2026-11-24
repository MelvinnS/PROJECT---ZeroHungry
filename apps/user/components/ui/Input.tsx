import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-ink mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-2xl bg-surface px-4 py-3.5 text-ink placeholder:text-muted/60 transition-all duration-200 border border-transparent focus:border-primary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error ? "border-danger focus:ring-danger/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

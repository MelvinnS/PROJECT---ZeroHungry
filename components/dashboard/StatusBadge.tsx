import React from "react";
import { Check, AlertTriangle, X } from "lucide-react";

export interface StatusBadgeProps {
  status: "aman" | "waspada" | "tidak_aman" | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  if (status === "aman") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B6B3A] text-white select-none ${className}`}
      >
        <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        <span>Aman</span>
      </span>
    );
  }

  if (status === "waspada") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[#1B6B3A] text-[#1B6B3A] bg-transparent select-none ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        <span>Waspada</span>
      </span>
    );
  }

  // tidak_aman / lainnya
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#111111] text-white select-none ${className}`}
    >
      <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
      <span>Tidak Aman</span>
    </span>
  );
};

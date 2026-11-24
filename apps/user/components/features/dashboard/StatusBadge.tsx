import React from "react";
import { Check, AlertTriangle, X } from "lucide-react";

export interface StatusBadgeProps {
  status: "aman" | "waspada" | "tidak_aman" | string;
  lengkap?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  lengkap = false,
  className = "",
}) => {
  if (status === "aman") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1B6B3A] text-white select-none ${className}`}
      >
        <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        <span>{lengkap ? "Aman Dikonsumsi" : "Aman"}</span>
      </span>
    );
  }

  if (status === "waspada") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#1B6B3A] text-[#1B6B3A] bg-transparent select-none ${className}`}
      >
        <AlertTriangle className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        <span>{lengkap ? "Perlu Waspada" : "Waspada"}</span>
      </span>
    );
  }

  // tidak_aman / lainnya
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#111111] text-white select-none ${className}`}
    >
      <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
      <span>{lengkap ? "Tidak Aman Dikonsumsi" : "Tidak Aman"}</span>
    </span>
  );
};

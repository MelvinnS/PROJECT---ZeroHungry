import React from "react";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-black/[0.06] bg-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Kiri: Logo + Nama */}
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-bold text-ink text-sm sm:text-base tracking-tight">
            Dari Sisa Jadi Nilai
          </span>
        </div>

        {/* Kanan: Hak Cipta */}
        <p className="text-xs sm:text-sm text-muted">
          &copy; 2026 Dari Sisa Jadi Nilai
        </p>
      </div>
    </footer>
  );
};

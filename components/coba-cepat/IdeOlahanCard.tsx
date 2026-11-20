"use client";

import React, { useId } from "react";
import { ChefHat, Timer, Check, ChevronDown, Wrench, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { HasilAnalisis } from "@/lib/schemas";

type IdeOlahan = HasilAnalisis["ide_olahan"][number];

interface IdeOlahanCardProps {
  ide: IdeOlahan;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const IdeOlahanCard: React.FC<IdeOlahanCardProps> = ({
  ide,
  isOpen,
  onToggle,
}) => {
  const panelId = useId();
  const buttonId = useId();

  // Mapping kesulitan ke badge variant
  let difficultyVariant: "success" | "warning" | "danger" = "success";
  let difficultyLabel = "Mudah";
  if (ide.tingkat_kesulitan === "sedang") {
    difficultyVariant = "warning";
    difficultyLabel = "Sedang";
  } else if (ide.tingkat_kesulitan === "sulit") {
    difficultyVariant = "danger";
    difficultyLabel = "Sulit";
  }

  return (
    <div className="rounded-[24px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 sm:p-6 transition-all">
      {/* Header Kartu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          {/* Kotak Ikon ChefHat (Bukan foto) */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-primary-soft flex items-center justify-center text-primary shrink-0">
            <ChefHat className="w-8 h-8 stroke-[1.8]" />
          </div>

          {/* Info Nama, Durasi, dan Tingkat Kesulitan */}
          <div className="flex flex-col text-left">
            <h3 className="font-bold text-base sm:text-lg text-ink leading-snug break-words">
              {ide.nama}
            </h3>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted font-medium">
                <Timer className="w-3.5 h-3.5" />
                {ide.durasi_menit} menit
              </span>
              <Badge variant={difficultyVariant} className="text-[11px] py-0.5">
                {difficultyLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tombol Toggle Accordion */}
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary-soft text-primary hover:bg-[#d8edd6] transition-colors cursor-pointer w-full sm:w-auto shrink-0 min-h-[44px]"
        >
          <span>{isOpen ? "Tutup Langkah" : "Lihat Langkah"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Panel Detail Accordion */}
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="mt-5 pt-5 border-t border-black/[0.06] text-left animate-fade-in"
        >
          {/* Deskripsi */}
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-4">
            {ide.deskripsi}
          </p>

          {/* Chip Info: Estimasi Biaya, Porsi, Umur Simpan Hasil */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-surface text-xs sm:text-sm font-semibold text-ink border border-black/[0.04]">
              Estimasi biaya: Rp{ide.estimasi_biaya_rp.toLocaleString("id-ID")}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-surface text-xs sm:text-sm font-semibold text-ink border border-black/[0.04]">
              {ide.estimasi_porsi} porsi
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-surface text-xs sm:text-sm font-semibold text-ink border border-black/[0.04]">
              Tahan {ide.umur_simpan_hasil_hari} hari
            </span>
          </div>

          {/* Bahan Tambahan */}
          {ide.bahan_tambahan && ide.bahan_tambahan.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-2.5">
                Bahan Tambahan
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ide.bahan_tambahan.map((bahan, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm text-ink/90"
                  >
                    <span className="w-4 h-4 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="font-semibold">{bahan.jumlah}</strong>{" "}
                      {bahan.nama}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Langkah-langkah Pembuatan */}
          {ide.langkah && ide.langkah.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">
                Langkah Pembuatan
              </h4>
              <ol className="flex flex-col gap-3">
                {ide.langkah.map((langkah, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{langkah}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips Tambahan */}
          {ide.tips && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Tips: </strong>
                <span>{ide.tips}</span>
              </div>
            </div>
          )}

          {/* Alat yang Dibutuhkan */}
          {ide.alat_dibutuhkan && ide.alat_dibutuhkan.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted pt-2 border-t border-black/[0.04]">
              <Wrench className="w-3.5 h-3.5" />
              <span>
                Alat yang dibutuhkan:{" "}
                <strong className="text-ink font-semibold">
                  {ide.alat_dibutuhkan.join(", ")}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

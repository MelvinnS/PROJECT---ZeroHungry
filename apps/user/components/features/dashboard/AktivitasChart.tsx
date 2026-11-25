"use client";

import React, { useState } from "react";
import type { TitikGrafik } from "@/lib/riwayat-types";
import { formatKg } from "@/lib/kalkulator";

interface AktivitasChartProps {
  mingguan: TitikGrafik[];
  bulanan: TitikGrafik[];
}

export const AktivitasChart: React.FC<AktivitasChartProps> = ({
  mingguan,
  bulanan,
}) => {
  const [mode, setMode] = useState<"minggu" | "bulan">("minggu");

  const data = mode === "minggu" ? mingguan : bulanan;
  const isAllZero = data.every((d) => d.kg === 0);

  // Cari nilai maksimum untuk skala dan default tooltip
  const maxKg = Math.max(...data.map((d) => d.kg), 0);
  const maxIndex = data.findIndex((d) => d.kg === maxKg && maxKg > 0);

  // State bar yang sedang dipilih/hover/fokus (default ke bar tertinggi)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Index yang aktif menampilkan tooltip (jika belum dipilih user, pakai maxIndex jika ada)
  const activeIndex =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < data.length
      ? selectedIndex
      : maxIndex >= 0
      ? maxIndex
      : null;

  const totalKg = data.reduce((acc, curr) => acc + curr.kg, 0);
  const ariaChartLabel = `Grafik aktivitas penyelamatan pangan ${
    mode === "minggu" ? "4 minggu terakhir" : "6 bulan terakhir"
  }. Total ${formatKg(totalKg)} kg diselamatkan.`;

  return (
    <div className="w-full">
      {/* Header Aktivitas & Toggle Pill */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#111111]">Aktivitas</h2>
        <div
          role="tablist"
          aria-label="Pilihan rentang waktu grafik aktivitas"
          className="inline-flex items-center p-1 rounded-full bg-[#E8F5EC] border border-[#1B6B3A]/10 text-xs font-semibold"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "minggu"}
            onClick={() => {
              setMode("minggu");
              setSelectedIndex(null);
            }}
            className={`min-h-[32px] px-3.5 py-1 rounded-full transition-all select-none ${
              mode === "minggu"
                ? "bg-[#0F4D2E] text-white shadow-xs font-bold"
                : "text-[#6B6B6B] hover:text-[#111111]"
            }`}
          >
            Minggu
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "bulan"}
            onClick={() => {
              setMode("bulan");
              setSelectedIndex(null);
            }}
            className={`min-h-[32px] px-3.5 py-1 rounded-full transition-all select-none ${
              mode === "bulan"
                ? "bg-[#0F4D2E] text-white shadow-xs font-bold"
                : "text-[#6B6B6B] hover:text-[#111111]"
            }`}
          >
            Bulan
          </button>
        </div>
      </div>

      {/* Kartu Grafik */}
      <div
        className="w-full bg-[#F3F7F4] rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 border border-black/[0.04] relative overflow-hidden"
        role="img"
        aria-label={ariaChartLabel}
      >
        {/* Dekorasi latar halus */}
        <div
          className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#E8F5EC]/50 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {isAllZero ? (
          <div className="py-14 sm:py-16 text-center flex flex-col items-center justify-center">
            <p className="text-sm sm:text-base font-semibold text-[#6B6B6B]">
              Belum ada data. Simpan analisis pertamamu.
            </p>
          </div>
        ) : (
          <div className="relative pt-10 pb-2">
            {/* Wadah Bar Grafik */}
            <div className="flex items-end justify-around gap-2 sm:gap-4 h-44 sm:h-52 w-full">
              {data.map((item, idx) => {
                const heightPercent =
                  maxKg > 0 ? Math.max(12, Math.round((item.kg / maxKg) * 85)) : 12;
                const isPeak = idx === maxIndex && maxKg > 0;
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex flex-col items-center flex-1 max-w-[56px] h-full justify-end group cursor-pointer"
                    onClick={() => setSelectedIndex(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onFocus={() => setSelectedIndex(idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.label}: ${formatKg(item.kg)} kg`}
                  >
                    {/* Tooltip Nilai Di Atas Batang */}
                    <div
                      className={`mb-2 transition-all duration-200 ${
                        isActive
                          ? "opacity-100 transform -translate-y-0.5"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <span className="inline-block bg-[#0F4D2E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap tabular-nums">
                        {formatKg(item.kg)} kg
                      </span>
                    </div>

                    {/* Batang Visual */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-2xl rounded-b-md transition-all duration-300 ${
                        isPeak || isActive
                          ? "bg-[#0F4D2E] shadow-xs"
                          : "bg-[#1B6B3A]/60 hover:bg-[#1B6B3A]"
                      }`}
                    />

                    {/* Label Bawah (Tanggal / Bulan) */}
                    <span className="mt-3 text-xs font-semibold text-[#6B6B6B] group-hover:text-[#111111] transition-colors truncate max-w-full text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

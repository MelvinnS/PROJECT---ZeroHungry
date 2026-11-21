"use client";

import React from "react";
import { formatRupiah } from "@/lib/kalkulator";

interface BarChartSederhanaProps {
  untungMentah: number;
  untungOlahan: number;
}

export const BarChartSederhana: React.FC<BarChartSederhanaProps> = ({
  untungMentah,
  untungOlahan,
}) => {
  // Hitung batas atas dan batas bawah grafik
  const maxVal = Math.max(0, untungMentah, untungOlahan);
  const minVal = Math.min(0, untungMentah, untungOlahan);

  // Jika kedua nilai 0, gunakan nilai default agar tidak division by zero
  const upper = maxVal > 0 ? maxVal * 1.25 : 1000;
  const lower = minVal < 0 ? minVal * 1.25 : 0;
  const totalSpan = upper - lower;

  // Dimensi SVG
  const svgWidth = 360;
  const svgHeight = 220;
  const chartTop = 35;
  const chartBottom = 175;
  const chartHeight = chartBottom - chartTop;

  // Posisi Y garis nol (Zero Line)
  const zeroY = chartTop + ((upper - 0) / totalSpan) * chartHeight;

  // Fungsi menghitung tinggi dan posisi Y balok
  const getBarGeometry = (val: number) => {
    const h = (Math.abs(val) / totalSpan) * chartHeight;
    if (val >= 0) {
      const y = zeroY - h;
      return { y, h, labelY: y - 8, isNegative: false };
    } else {
      const y = zeroY;
      return { y, h, labelY: y + h + 16, isNegative: true };
    }
  };

  const mentahGeo = getBarGeometry(untungMentah);
  const olahanGeo = getBarGeometry(untungOlahan);

  const ariaDescription = `Grafik perbandingan keuntungan: Untung Jual Mentah ${formatRupiah(
    untungMentah
  )}, Untung Olah Dulu ${formatRupiah(untungOlahan)}.`;

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-black/[0.06]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Perbandingan Keuntungan
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
            <span className="text-muted">Mentah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded inline-block ${
                untungOlahan >= 0 ? "bg-[#1B6B3A]" : "bg-rose-500"
              }`}
            />
            <span className="text-muted">Olahan</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[220px]"
          role="img"
          aria-label={ariaDescription}
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        >
          {/* Garis Nol (Zero Axis) */}
          <line
            x1="30"
            y1={zeroY}
            x2={svgWidth - 30}
            y2={zeroY}
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Batang 1: Jual Mentah */}
          <g>
            <rect
              x="70"
              y={mentahGeo.y}
              width="75"
              height={Math.max(mentahGeo.h, 2)}
              rx="6"
              fill="#94A3B8"
              className="transition-all duration-300"
            />
            {/* Label Nilai di Atas/Bawah Batang */}
            <text
              x="107.5"
              y={mentahGeo.labelY}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-700 tabular-nums"
            >
              {formatRupiah(untungMentah)}
            </text>
            {/* Label Kategori */}
            <text
              x="107.5"
              y={svgHeight - 12}
              textAnchor="middle"
              className="text-[12px] font-semibold fill-slate-600"
            >
              Jual Mentah
            </text>
          </g>

          {/* Batang 2: Olah Dulu */}
          <g>
            <rect
              x="215"
              y={olahanGeo.y}
              width="75"
              height={Math.max(olahanGeo.h, 2)}
              rx="6"
              fill={untungOlahan >= 0 ? "#1B6B3A" : "#E11D48"}
              className="transition-all duration-300"
            />
            {/* Label Nilai di Atas/Bawah Batang */}
            <text
              x="252.5"
              y={olahanGeo.labelY}
              textAnchor="middle"
              className={`text-[11px] font-bold tabular-nums ${
                untungOlahan >= 0 ? "fill-[#1B6B3A]" : "fill-rose-600"
              }`}
            >
              {formatRupiah(untungOlahan)}
            </text>
            {/* Label Kategori */}
            <text
              x="252.5"
              y={svgHeight - 12}
              textAnchor="middle"
              className="text-[12px] font-semibold fill-slate-600"
            >
              Olah Dulu
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

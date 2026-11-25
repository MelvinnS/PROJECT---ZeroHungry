"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Clock,
  ArrowRight,
  Leaf,
  Apple,
  Fish,
  Bean,
  Wheat,
  Utensils,
  Hourglass,
} from "lucide-react";
import type { RiwayatItem } from "@/lib/riwayat-types";
import { StatusBadge } from "./StatusBadge";

interface RiwayatClientProps {
  riwayat: RiwayatItem[];
}

function getKategoriIcon(kategori: string) {
  const k = (kategori || "").toLowerCase();
  switch (k) {
    case "sayur":
      return Leaf;
    case "buah":
      return Apple;
    case "protein_hewani":
      return Fish;
    case "protein_nabati":
      return Bean;
    case "karbohidrat":
      return Wheat;
    default:
      return Utensils;
  }
}

function getJakartaDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    year: parseInt(map.year, 10),
    month: parseInt(map.month, 10),
    day: parseInt(map.day, 10),
    hour: (map.hour || "00").padStart(2, "0"),
    minute: (map.minute || "00").padStart(2, "0"),
  };
}

function getCalendarDayDiff(now: Date, target: Date): number {
  const nowP = getJakartaDateParts(now);
  const targetP = getJakartaDateParts(target);
  const nowUtc = Date.UTC(nowP.year, nowP.month - 1, nowP.day);
  const targetUtc = Date.UTC(targetP.year, targetP.month - 1, targetP.day);
  return Math.round((nowUtc - targetUtc) / (24 * 60 * 60 * 1000));
}

function formatSubtitleDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const dayDiff = getCalendarDayDiff(now, d);
    const parts = getJakartaDateParts(d);

    if (dayDiff === 0) {
      return `Hari ini, ${parts.hour}.${parts.minute}`;
    }
    if (dayDiff === 1) {
      return "Kemarin";
    }
    return d.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

function getUmurSimpanLabel(item: RiwayatItem): string {
  if (item.keamanan === "tidak_aman") {
    return "Tidak layak";
  }
  const min = item.hasil?.umur_simpan?.hari_min ?? 0;
  const max = item.hasil?.umur_simpan?.hari_maks ?? 0;
  if (min === 0 && max === 0) {
    return "Tidak layak";
  }
  if (min === max) {
    return `Sisa ${min} hari`;
  }
  return `Sisa ${min}–${max} hari`;
}

export const RiwayatClient: React.FC<RiwayatClientProps> = ({ riwayat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "semua" | "aman" | "waspada" | "tidak_aman"
  >("semua");

  // Filter gabungan live (Search + Chip Status)
  const filteredList = useMemo(() => {
    return riwayat.filter((item) => {
      if (filterStatus !== "semua" && item.keamanan !== filterStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const namaCocok = item.nama_bahan.toLowerCase().includes(q);
        const kondisiCocok = item.kondisi.toLowerCase().includes(q);
        const kategoriCocok = item.kategori.toLowerCase().includes(q);
        if (!namaCocok && !kondisiCocok && !kategoriCocok) {
          return false;
        }
      }
      return true;
    });
  }, [riwayat, filterStatus, searchQuery]);

  // Kelompokkan data berdasarkan tanggal: MINGGU INI, BULAN INI, LEBIH LAMA
  const groups = useMemo(() => {
    const now = new Date();
    const nowP = getJakartaDateParts(now);

    const mingguIni: RiwayatItem[] = [];
    const bulanIni: RiwayatItem[] = [];
    const lebihLama: RiwayatItem[] = [];

    for (const item of filteredList) {
      const d = new Date(item.created_at);
      const dayDiff = getCalendarDayDiff(now, d);
      const targetP = getJakartaDateParts(d);

      if (dayDiff >= 0 && dayDiff < 7) {
        mingguIni.push(item);
      } else if (
        dayDiff < 30 ||
        (nowP.year === targetP.year && nowP.month === targetP.month)
      ) {
        bulanIni.push(item);
      } else {
        lebihLama.push(item);
      }
    }

    const result: { title: string; items: RiwayatItem[] }[] = [];
    if (mingguIni.length > 0) {
      result.push({ title: "MINGGU INI", items: mingguIni });
    }
    if (bulanIni.length > 0) {
      result.push({ title: "BULAN INI", items: bulanIni });
    }
    if (lebihLama.length > 0) {
      result.push({ title: "LEBIH LAMA", items: lebihLama });
    }
    return result;
  }, [filteredList]);

  return (
    <div className="flex flex-col gap-6 pb-16 animate-fade-in max-w-5xl">
      {/* ─────────────────────────────────────────────────────────────
          1) HEADER HALAMAN
         ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Riwayat Analisis
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] mt-1 font-medium">
          Semua bahan yang pernah kamu selamatkan.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2) SEARCH PILL + CHIP FILTER
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Search Pill */}
        <div className="w-full bg-[#F3F7F4] border border-black/[0.04] focus-within:border-[#1B6B3A]/40 focus-within:bg-white rounded-full px-5 py-3 min-h-[48px] flex items-center gap-3 transition-all shadow-xs">
          <Search className="w-5 h-5 text-[#6B6B6B] shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bahan…"
            aria-label="Cari bahan riwayat analisis"
            className="w-full bg-transparent text-[#111111] placeholder:text-[#6B6B6B] text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Chip Filter */}
        <div
          role="group"
          aria-label="Pilih filter status keamanan bahan"
          className="flex flex-wrap gap-2"
        >
          {(
            [
              { key: "semua", label: "Semua" },
              { key: "aman", label: "Aman" },
              { key: "waspada", label: "Waspada" },
              { key: "tidak_aman", label: "Tidak Aman" },
            ] as const
          ).map((chip) => {
            const isActive = filterStatus === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilterStatus(chip.key)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-all select-none ${
                  isActive
                    ? "bg-[#1B6B3A] text-white shadow-xs font-bold"
                    : "bg-[#F3F7F4] text-[#6B6B6B] hover:text-[#111111] border border-black/[0.04]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3) DAFTAR KELOMPOK RIWAYAT
         ───────────────────────────────────────────────────────────── */}
      <div aria-live="polite" className="mt-2 flex flex-col gap-8">
        {riwayat.length === 0 ? (
          /* Keadaan Kosong Total */
          <div className="bg-[#F3F7F4] rounded-[32px] p-8 sm:p-14 text-center flex flex-col items-center justify-center border border-black/[0.04]">
            <div className="w-16 h-16 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center mb-4 shadow-xs">
              <Clock className="w-8 h-8 stroke-[2.2]" aria-hidden="true" />
            </div>
            <h2 className="font-extrabold text-lg sm:text-xl text-[#111111] mb-1">
              Belum ada riwayat
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mb-6 leading-relaxed">
              Semua bahan pangan yang kamu analisis dan simpan akan tercatat di
              sini untuk memantau umur simpan dan ide olahannya.
            </p>
            <Link
              href="/coba-cepat"
              className="inline-flex items-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4D2E] text-white font-extrabold px-6 py-3.5 rounded-full text-sm transition-all min-h-[44px] shadow-xs active:scale-95 select-none"
            >
              <span>Analisis Bahan Pertama</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : filteredList.length === 0 ? (
          /* Keadaan Filter Kosong */
          <div className="bg-[#F3F7F4] rounded-[24px] p-8 text-center text-[#6B6B6B] text-sm font-semibold border border-black/[0.04]">
            Tidak ada yang cocok.
          </div>
        ) : (
          /* Daftar Grup */
          groups.map((group) => (
            <section key={group.title} className="flex flex-col gap-3">
              {/* Header Grup Tanggal */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  {group.title}
                </span>
                <span className="text-xs font-semibold text-[#6B6B6B]">
                  {group.items.length} entri
                </span>
              </div>

              {/* Grid Kartu: Desktop 2 Kolom, Mobile 1 Kolom */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                {group.items.map((item) => {
                  const IconKategori = getKategoriIcon(item.kategori);
                  const formattedSubtitle = `${item.jumlah} ${item.satuan} · ${formatSubtitleDate(
                    item.created_at
                  )}`;
                  const umurSimpanText = getUmurSimpanLabel(item);

                  return (
                    <Link
                      key={item.id}
                      href={`/dashboard/riwayat/${item.id}`}
                      className="bg-[#F3F7F4] hover:bg-[#E8F5EC]/60 border border-black/[0.04] rounded-[24px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all group select-none min-h-[72px]"
                    >
                      {/* Bagian Kiri: Ikon, Nama Bahan & Subtitle Tanggal */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center shrink-0 shadow-xs">
                          <IconKategori className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm sm:text-base text-[#111111] group-hover:text-[#0F4D2E] transition-colors truncate">
                            {item.nama_bahan}
                          </div>
                          <div className="text-xs text-[#6B6B6B] mt-0.5 truncate">
                            {formattedSubtitle}
                          </div>
                        </div>
                      </div>

                      {/* Bagian Kanan: StatusBadge, Umur Simpan, Chevron */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                        <StatusBadge status={item.keamanan} />
                        <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-medium whitespace-nowrap">
                          <Hourglass className="w-3.5 h-3.5 text-[#1B6B3A]" aria-hidden="true" />
                          <span>{umurSimpanText}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

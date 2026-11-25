"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  User,
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Calculator,
  Utensils,
  Leaf,
  Apple,
  Fish,
  Bean,
  Wheat,
  Clock,
} from "lucide-react";
import type { Profil } from "@/lib/auth-client";
import type { RingkasanRiwayat, RiwayatItem } from "@/lib/riwayat-types";
import { formatRupiah, formatKg } from "@/lib/kalkulator";
import { StatusBadge } from "./StatusBadge";
import { AktivitasChart } from "./AktivitasChart";

interface DashboardViewProps {
  profil: Profil;
  ringkasan: RingkasanRiwayat;
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

function formatTanggalSingkat(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profil,
  ringkasan,
  riwayat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "semua" | "aman" | "waspada" | "tidak_aman"
  >("semua");

  const namaDepan = profil.nama ? profil.nama.split(" ")[0] : "Teman";

  // Filter daftar riwayat secara live
  const filteredRiwayat = useMemo(() => {
    return riwayat.filter((item) => {
      // Filter status keamanan
      if (filterStatus !== "semua" && item.keamanan !== filterStatus) {
        return false;
      }

      // Filter teks pencarian (nama bahan atau kondisi)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const namaCocok = item.nama_bahan.toLowerCase().includes(q);
        const kondisiCocok = item.kondisi.toLowerCase().includes(q);
        if (!namaCocok && !kondisiCocok) {
          return false;
        }
      }

      return true;
    });
  }, [riwayat, filterStatus, searchQuery]);

  // Maksimal 4 kartu riwayat yang ditampilkan di dashboard
  const displayRiwayat = filteredRiwayat.slice(0, 4);

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          A) BARIS SAPAAN
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center shrink-0 shadow-xs">
            <User className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
              Halo, {namaDepan}!
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
              Selamat datang kembali
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          B) HERO CARD (FOREST #0F4D2E, ROUNDED 32PX, POLA DAUN SAMAR)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0F4D2E] rounded-[32px] p-6 sm:p-9 text-white relative overflow-hidden shadow-sm">
        {/* Dekorasi siluet daun sangat samar dekoratif */}
        <div
          className="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="320"
            height="320"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 20C60 20 20 60 20 100C20 140 60 180 100 180C140 180 180 140 180 100C180 60 140 20 100 20Z"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M100 40C70 40 40 70 40 100C40 130 70 160 100 160C130 160 160 130 160 100C160 70 130 40 100 40Z"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M60 140C90 110 110 90 140 60"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-start max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
            FOOD RESCUE TOTAL
          </span>
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight tabular-nums">
            {formatKg(ringkasan.totalKg)} kg
          </div>
          <p className="text-white/90 text-sm sm:text-base mt-2 mb-6 font-medium">
            makanan yang sudah kamu selamatkan
          </p>
          <Link
            href="/coba-cepat"
            className="inline-flex items-center gap-2 bg-white text-[#0F4D2E] hover:bg-zinc-100 font-extrabold px-6 py-3.5 rounded-full text-sm shadow-xs transition-all active:scale-95 select-none min-h-[44px]"
          >
            <span>Analisis Bahan Baru</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          C) SEARCH PILL
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full">
        <div className="w-full bg-[#F3F7F4] border border-black/[0.04] focus-within:border-[#1B6B3A]/40 focus-within:bg-white rounded-full px-5 py-3 min-h-[48px] flex items-center gap-3 transition-all shadow-xs">
          <Search className="w-5 h-5 text-[#6B6B6B] shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari riwayat bahan…"
            aria-label="Cari riwayat bahan"
            className="w-full bg-transparent text-[#111111] placeholder:text-[#6B6B6B] text-sm sm:text-base focus:outline-none"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          D) DAMPAKMU (3 KARTU SAMA BESAR, 3 KOLOM DI MOBILE)
         ───────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-[#111111] mb-3">Dampakmu</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Kartu 1: Rupiah dihemat */}
          <div className="bg-[#F3F7F4] rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 border border-black/[0.04] flex flex-col justify-between">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center mb-2.5 sm:mb-4 shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs sm:text-base md:text-lg font-black text-[#111111] tabular-nums truncate">
                {formatRupiah(ringkasan.totalRupiah)}
              </div>
              <div className="text-[11px] sm:text-xs text-[#6B6B6B] font-medium mt-0.5">
                dihemat
              </div>
            </div>
          </div>

          {/* Kartu 2: Porsi setara */}
          <div className="bg-[#F3F7F4] rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 border border-black/[0.04] flex flex-col justify-between">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center mb-2.5 sm:mb-4 shrink-0 shadow-xs">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs sm:text-base md:text-lg font-black text-[#111111] tabular-nums truncate">
                {ringkasan.totalPorsi} porsi
              </div>
              <div className="text-[11px] sm:text-xs text-[#6B6B6B] font-medium mt-0.5">
                setara
              </div>
            </div>
          </div>

          {/* Kartu 3: Bahan diselamatkan */}
          <div className="bg-[#F3F7F4] rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 border border-black/[0.04] flex flex-col justify-between">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center mb-2.5 sm:mb-4 shrink-0 shadow-xs">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs sm:text-base md:text-lg font-black text-[#111111] tabular-nums truncate">
                {ringkasan.jumlahBahan} bahan
              </div>
              <div className="text-[11px] sm:text-xs text-[#6B6B6B] font-medium mt-0.5">
                diselamatkan
              </div>
            </div>
          </div>
        </div>

        {/* G) KARTU KHUSUS USAHA/ADMIN: KALKULATOR MENTAH VS OLAHAN */}
        {(profil.role === "usaha" || profil.role === "admin") && (
          <div className="mt-4 bg-[#F3F7F4] rounded-[28px] p-5 sm:p-6 border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center shrink-0 shadow-xs">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                  Kalkulator Mentah vs Olahan
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  Bandingkan untung jual mentah dan olah dulu.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/kalkulator"
              className="inline-flex items-center justify-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4D2E] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shrink-0 min-h-[44px]"
            >
              <span>Buka Kalkulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          E) AKTIVITAS (TOGGLE MINGGU | BULAN & GRAFIK BATANG)
         ───────────────────────────────────────────────────────────── */}
      <AktivitasChart
        mingguan={ringkasan.mingguan}
        bulanan={ringkasan.bulanan}
      />

      {/* ─────────────────────────────────────────────────────────────
          F) RIWAYAT TERAKHIR
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Header Bagian & Link Lihat Semua */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111111]">Riwayat Terakhir</h2>
          <Link
            href="/dashboard/riwayat"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1B6B3A] hover:text-[#0F4D2E] transition-colors"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Chip Filter Keamanan */}
        <div
          role="group"
          aria-label="Filter status keamanan riwayat"
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

        {/* Hasil Riwayat (Aria-live untuk aksesibilitas) */}
        <div aria-live="polite">
          {riwayat.length === 0 ? (
            /* Keadaan Awal Kosong Total */
            <div className="bg-[#F3F7F4] rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-black/[0.04]">
              <div className="w-12 h-12 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center mb-3 shadow-xs">
                <Clock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-base text-[#111111] mb-1">
                Belum ada riwayat
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mb-5">
                Simpan analisis bahan sisa dapurmu untuk memantau jejak kebaikan
                dan dampak lingkungan.
              </p>
              <Link
                href="/coba-cepat"
                className="inline-flex items-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4D2E] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all min-h-[44px]"
              >
                <span>Analisis Bahan Pertama</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : displayRiwayat.length === 0 ? (
            /* Keadaan Filter / Cari Tidak Ada Hasil */
            <div className="bg-[#F3F7F4] rounded-[24px] p-8 text-center text-[#6B6B6B] text-sm font-semibold border border-black/[0.04]">
              Tidak ada yang cocok.
            </div>
          ) : (
            /* Daftar Kartu (Desktop 2 kolom, Mobile 1 kolom) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              {displayRiwayat.map((item) => {
                const IconKategori = getKategoriIcon(item.kategori);
                const tglSingkat = formatTanggalSingkat(item.created_at);

                return (
                  <Link
                    key={item.id}
                    href={`/dashboard/riwayat/${item.id}`}
                    className="bg-[#F3F7F4] hover:bg-[#E8F5EC]/60 border border-black/[0.04] rounded-[24px] p-4 sm:p-5 flex items-center justify-between gap-3 transition-all group select-none min-h-[64px]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#E8F5EC] text-[#1B6B3A] flex items-center justify-center shrink-0 shadow-xs">
                        <IconKategori className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base text-[#111111] group-hover:text-[#0F4D2E] transition-colors truncate">
                          {item.nama_bahan}
                        </div>
                        <div className="text-xs text-[#6B6B6B] mt-0.5 truncate">
                          {item.jumlah} {item.satuan} · {tglSingkat}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={item.keamanan} />
                      <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

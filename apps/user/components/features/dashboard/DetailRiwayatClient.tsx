"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Info,
  Trash2,
  Sparkles,
  AlertOctagon,
} from "lucide-react";
import type { RiwayatItem } from "@/lib/riwayat";
import { StatusBadge } from "./StatusBadge";
import { IdeOlahanCard } from "@/components/features/coba-cepat/IdeOlahanCard";
import { ChefChat } from "@/components/features/chef/ChefChat";

interface DetailRiwayatClientProps {
  riwayat: RiwayatItem;
}

function getJakartaDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    hour: (map.hour || "00").padStart(2, "0"),
    minute: (map.minute || "00").padStart(2, "0"),
  };
}

function formatWaktuSimpan(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const dateFormatted = d.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const parts = getJakartaDateParts(d);
    return `${dateFormatted}, ${parts.hour}.${parts.minute} WIB`;
  } catch {
    return "";
  }
}

export const DetailRiwayatClient: React.FC<DetailRiwayatClientProps> = ({
  riwayat,
}) => {
  const router = useRouter();
  const { hasil } = riwayat;

  const [openCardIndex, setOpenCardIndex] = useState<number | null>(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isTidakAman = riwayat.keamanan === "tidak_aman";
  const waktuSimpanFormatted = formatWaktuSimpan(riwayat.created_at);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/riwayat?id=${riwayat.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard/riwayat");
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => null);
        console.error("Gagal menghapus riwayat:", errJson);
        setDeleteError("Gagal menghapus, coba lagi.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Error jaringan saat menghapus riwayat:", err);
      setDeleteError("Gagal menghapus, coba lagi.");
      setIsDeleting(false);
    }
  };

  const handleToggleCard = (index: number) => {
    setOpenCardIndex((prev) => (prev === index ? null : index));
  };

  const umurSimpanText =
    hasil.umur_simpan.hari_min === 0 && hasil.umur_simpan.hari_maks === 0
      ? "Tidak layak disimpan"
      : hasil.umur_simpan.hari_min === hasil.umur_simpan.hari_maks
      ? `Sisa umur simpan: ${hasil.umur_simpan.hari_min} hari`
      : `Sisa umur simpan: ${hasil.umur_simpan.hari_min}–${hasil.umur_simpan.hari_maks} hari`;

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-4xl animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1) HEADER FOREST DENGAN TEPI BAWAH MELENGKUNG
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0F4D2E] rounded-[32px] p-6 sm:p-9 text-white relative overflow-hidden shadow-sm">
        {/* Dekorasi siluet garis daun sangat samar */}
        <div
          className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="280"
            height="280"
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
              d="M60 140C90 110 110 90 140 60"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-start gap-4">
          {/* Tombol Bulat Putih Kembali */}
          <Link
            href="/dashboard/riwayat"
            className="w-11 h-11 rounded-full bg-white text-[#0F4D2E] hover:bg-zinc-100 flex items-center justify-center transition-transform active:scale-95 shadow-xs select-none"
            aria-label="Kembali ke halaman Riwayat Analisis"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </Link>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 block mb-1">
              DETAIL PENYELAMATAN
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight break-words">
              {riwayat.nama_bahan}
            </h1>
          </div>

          {/* Pill Putih: Jumlah Satuan & Kondisi */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#0F4D2E] shadow-xs select-none">
              {riwayat.jumlah} {riwayat.satuan}
            </span>
            <span
              title={riwayat.kondisi}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#0F4D2E] shadow-xs truncate max-w-[220px] sm:max-w-md select-none"
            >
              {riwayat.kondisi}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2) KARTU STATUS PUTIH MELAYANG MENIMPA HEADER
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-black/[0.06] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] -mt-4 relative z-20 flex flex-col gap-5">
        {/* Baris Status Badge & Sumber Analisis */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <StatusBadge status={riwayat.keamanan} lengkap={true} />

          {riwayat.source === "fallback" ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#1B6B3A] text-[#1B6B3A] bg-transparent">
              Mode Contoh
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5EC] text-[#1B6B3A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisis AI</span>
            </span>
          )}
        </div>

        {/* Alasan Keamanan */}
        <p className="text-sm sm:text-base text-[#111111] leading-relaxed">
          {hasil.keamanan.alasan}
        </p>

        {/* Catatan Tambahan (jika ada) */}
        {hasil.keamanan.catatan && (
          <div className="p-3.5 rounded-2xl bg-[#F3F7F4] border border-black/[0.04] flex items-start gap-2.5 text-xs sm:text-sm text-[#6B6B6B]">
            <Info className="w-4 h-4 text-[#1B6B3A] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{hasil.keamanan.catatan}</span>
          </div>
        )}

        {/* Pembatas Garis Tipis */}
        <hr className="border-black/[0.06]" />

        {/* Sisa Umur Simpan & Tips Penyimpanan */}
        <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#111111] font-bold">
            <Clock className="w-4 h-4 text-[#1B6B3A]" />
            <span>{umurSimpanText}</span>
          </div>
          {hasil.umur_simpan.tips_penyimpanan && (
            <p className="text-[#6B6B6B] text-xs sm:text-sm leading-relaxed pl-6">
              {hasil.umur_simpan.tips_penyimpanan}
            </p>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3) JIKA TIDAK AMAN: KOTAK OUTLINE HITAM (LEWATI IDE OLAHAN)
         ───────────────────────────────────────────────────────────── */}
      {isTidakAman ? (
        <div className="rounded-[28px] bg-[#F3F7F4] border-2 border-[#111111] p-6 sm:p-7 flex items-start gap-3.5 text-left">
          <AlertOctagon className="w-6 h-6 text-[#111111] shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-[#111111] font-semibold leading-relaxed">
            Sebaiknya jangan diolah atau dikonsumsi. Buang dengan aman dan cuci
            tangan serta peralatan.
          </p>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            4) IDE OLAHAN (ACCORDION DENGAN PROP MONO)
           ───────────────────────────────────────────────────────────── */
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xl sm:text-2xl text-[#111111]">
              Ide Olahan
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] bg-[#F3F7F4] px-3 py-1 rounded-full border border-black/[0.04]">
              {hasil.ide_olahan.length} pilihan
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {hasil.ide_olahan.map((ide, idx) => (
              <IdeOlahanCard
                key={idx}
                ide={ide}
                index={idx}
                isOpen={openCardIndex === idx}
                onToggle={() => handleToggleCard(idx)}
                mono={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5) FOOTER KARTU: WAKTU SIMPAN & HAPUS DARI RIWAYAT
         ───────────────────────────────────────────────────────────── */}
      <div className="mt-4 bg-[#F3F7F4] rounded-[28px] p-5 sm:p-6 border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs sm:text-sm font-semibold text-[#6B6B6B]">
          Disimpan pada {waktuSimpanFormatted}
        </span>

        {showConfirmDelete ? (
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-[#111111]">
              Hapus riwayat ini?
            </span>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setShowConfirmDelete(false)}
              className="min-h-[44px] px-4 py-2 rounded-full text-xs font-bold border border-black/[0.12] text-[#111111] hover:bg-black/5 transition-all select-none"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="min-h-[44px] px-4 py-2 rounded-full text-xs font-bold bg-[#111111] hover:bg-black text-white transition-all shadow-xs disabled:opacity-50 select-none"
            >
              {isDeleting ? "Menghapus…" : "Ya, hapus"}
            </button>
            {deleteError && (
              <span className="text-xs text-rose-600 font-medium block w-full mt-1">
                {deleteError}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-[#111111] text-[#111111] hover:bg-black hover:text-white transition-all select-none shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus dari Riwayat</span>
          </button>
        )}
      </div>

      {/* ChefChat (mono, hanya jika bahan aman atau waspada) */}
      {!isTidakAman && (
        <ChefChat
          mono={true}
          konteks={{
            bahan: [
              {
                nama: hasil.bahan.nama_standar,
                keamanan: hasil.keamanan.aman_dikonsumsi,
                sisa:
                  hasil.umur_simpan.hari_min === 0 && hasil.umur_simpan.hari_maks === 0
                    ? "tidak layak disimpan"
                    : `${hasil.umur_simpan.hari_min}–${hasil.umur_simpan.hari_maks} hari`,
              },
            ],
          }}
          daftarResep={hasil.ide_olahan.map((ide) => ({
            nama: ide.nama,
            bahan_tambahan: ide.bahan_tambahan,
            langkah: ide.langkah,
          }))}
        />
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck,
  Check,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IdeOlahanCard } from "./IdeOlahanCard";
import { ChefChat } from "@/components/chef/ChefChat";
import type { HasilMulti, InputMulti } from "@/lib/schemas-multi";
import { toInputTunggal, toHasilTunggal } from "@/lib/multi-ke-tunggal";

interface HasilMultiViewProps {
  data: HasilMulti;
  inputPayload: InputMulti | null;
  source: "live" | "fallback" | null;
  isLoggedIn?: boolean;
  onReset: () => void;
}

export const HasilMultiView: React.FC<HasilMultiViewProps> = ({
  data,
  inputPayload,
  source,
  isLoggedIn = false,
  onReset,
}) => {
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(0);
  const [savedIndices, setSavedIndices] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const totalBahan = data.bahan.length;
  const allSaved = savedIndices.length === totalBahan && totalBahan > 0;

  const handleToggleCard = (index: number) => {
    setOpenCardIndex((prev) => (prev === index ? null : index));
  };

  const handleSimpanRiwayat = async () => {
    if (!inputPayload || isSaving || allSaved) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMessage(null);

    const pendingIndices = Array.from({ length: totalBahan }, (_, idx) => idx).filter(
      (idx) => !savedIndices.includes(idx)
    );

    const newSaved: number[] = [...savedIndices];
    let hasFailure = false;

    for (const i of pendingIndices) {
      try {
        const inputTunggal = toInputTunggal(inputPayload, i);
        const hasilTunggal = toHasilTunggal(data, i);

        const res = await fetch("/api/riwayat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: inputTunggal,
            hasil: hasilTunggal,
            source: source === "live" ? "live" : "fallback",
          }),
        });

        if (res.ok) {
          newSaved.push(i);
          setSavedIndices([...newSaved]);
        } else {
          hasFailure = true;
        }
      } catch (err) {
        console.error(`Gagal menyimpan riwayat untuk bahan ke-${i}:`, err);
        hasFailure = true;
      }
    }

    setIsSaving(false);

    if (hasFailure) {
      if (newSaved.length > 0) {
        setSaveErrorMessage("Sebagian gagal disimpan, coba lagi.");
      } else {
        setSaveErrorMessage("Gagal menyimpan, coba lagi.");
      }
    }
  };

  const adaBahanTidakAman = data.bahan.some(
    (b) => b.keamanan.aman_dikonsumsi === "tidak_aman"
  );
  const adaBahanAman = data.bahan.some(
    (b) => b.keamanan.aman_dikonsumsi === "aman" || b.keamanan.aman_dikonsumsi === "waspada"
  );
  const isFallbackDanIdeKosong =
    source === "fallback" && (data.ide_olahan || []).length === 0 && adaBahanAman;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 text-left animate-fade-in pb-12">
      {/* 0) Baris Atas: Tombol Kembali & Info Multi Bahan */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-[#15542d] transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analisis bahan lain</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface text-ink border border-black/[0.06]">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{totalBahan} Bahan Dianalisis</span>
          </span>
        </div>

        {/* Badge Sumber Hasil */}
        <div className="flex items-center">
          {source === "fallback" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/80">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>
                <strong className="font-semibold">Mode Contoh:</strong> Hasil ini dari data contoh, bukan analisis AI langsung.
              </span>
            </div>
          ) : (
            <Badge variant="primary" className="text-xs py-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisis AI</span>
            </Badge>
          )}
        </div>
      </div>

      {/* 1) Kartu Kondisi Bahan (Daftar semua bahan yang dianalisis) */}
      <div className="rounded-[24px] bg-white border border-black/[0.04] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg sm:text-xl text-ink">
            Kondisi Bahan
          </h2>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            {totalBahan} BAHAN
          </span>
        </div>

        <div className="flex flex-col divide-y divide-black/[0.06]">
          {data.bahan.map((b, idx) => {
            const isTidakAman = b.keamanan.aman_dikonsumsi === "tidak_aman";
            const isWaspada = b.keamanan.aman_dikonsumsi === "waspada";

            return (
              <div
                key={idx}
                className={`flex flex-col gap-2.5 ${idx === 0 ? "pb-4" : "py-4"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface text-xs font-bold text-muted flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-base text-ink">
                      {b.nama_standar}
                    </span>
                  </div>

                  {/* Badge Keamanan */}
                  {isTidakAman ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-danger border border-rose-200">
                      <XCircle className="w-4 h-4" />
                      <span>Tidak Aman</span>
                    </span>
                  ) : isWaspada ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Perlu Waspada</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-soft text-primary border border-primary/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aman</span>
                    </span>
                  )}
                </div>

                {/* Sisa Umur Simpan */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-ink pl-8">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-medium">
                    {isTidakAman || (b.umur_simpan.hari_min === 0 && b.umur_simpan.hari_maks === 0)
                      ? "Tidak layak disimpan"
                      : `Sisa ${b.umur_simpan.hari_min}–${b.umur_simpan.hari_maks} hari`}
                  </span>
                </div>

                {/* Alasan jika Waspada atau Tidak Aman */}
                {(isWaspada || isTidakAman) && b.keamanan.alasan && (
                  <p className="text-xs sm:text-sm text-muted pl-8 leading-relaxed">
                    {b.keamanan.alasan}
                  </p>
                )}

                {/* Catatan jika ada */}
                {b.keamanan.catatan && (
                  <p className="text-xs text-muted/80 pl-8 italic">
                    Catatan: {b.keamanan.catatan}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol Simpan ke Riwayat (Hanya jika pengguna login) */}
        {isLoggedIn && (
          <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {allSaved ? (
              <div className="flex items-center flex-wrap gap-2.5">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary-soft text-primary border border-primary/20 opacity-90 cursor-default"
                >
                  <Check className="w-4 h-4" />
                  <span>Tersimpan ({totalBahan} bahan)</span>
                </button>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-primary hover:underline hover:text-[#15542d] transition-colors"
                >
                  Lihat dashboard &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isSaving || !inputPayload}
                  onClick={handleSimpanRiwayat}
                  className="inline-flex items-center gap-2 w-fit border-primary text-primary hover:bg-primary-soft"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? "Menyimpan…"
                      : savedIndices.length > 0
                      ? `Simpan sisa (${totalBahan - savedIndices.length} bahan)`
                      : `Simpan ke Riwayat (${totalBahan} bahan)`}
                  </span>
                </Button>
                {saveErrorMessage && (
                  <p className="text-xs text-danger font-medium">
                    {saveErrorMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2) Peringatan jika ada bahan tidak aman */}
      {adaBahanTidakAman && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-950 animate-fade-in">
          <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            Bahan yang tidak aman sebaiknya dibuang dan tidak dipakai di resep.
          </p>
        </div>
      )}

      {/* 3) Info jika fallback mode contoh dan ide olahan kosong */}
      {isFallbackDanIdeKosong && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 animate-fade-in">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            Resep gabungan memerlukan analisis AI. Mode Contoh hanya menilai keamanan tiap bahan.
          </p>
        </div>
      )}

      {/* 4) Bagian Ide Olahan Gabungan */}
      {(data.ide_olahan || []).length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xl sm:text-2xl text-ink">
              Ide Olahan Gabungan
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {data.ide_olahan.length} RESEP GABUNGAN
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {data.ide_olahan.map((ide, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                {/* Chip bahan_dipakai di atas kartu ide olahan */}
                {ide.bahan_dipakai && ide.bahan_dipakai.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap px-2">
                    <span className="text-xs text-muted font-medium">Memakai:</span>
                    {ide.bahan_dipakai.map((namaBahan, bIdx) => (
                      <span
                        key={bIdx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20"
                      >
                        {namaBahan}
                      </span>
                    ))}
                  </div>
                )}
                <IdeOlahanCard
                  index={idx}
                  ide={ide}
                  isOpen={openCardIndex === idx}
                  onToggle={() => handleToggleCard(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5) Bagian Pengawetan (jika ada) */}
      {data.pengawetan && data.pengawetan.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="font-extrabold text-lg sm:text-xl text-ink">
            Cara Menyimpan Lebih Lama
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.pengawetan.slice(0, 2).map((awet, idx) => (
              <div
                key={idx}
                className="p-5 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-base text-ink">
                      {awet.metode}
                    </h4>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-soft text-primary shrink-0">
                      +{awet.tambahan_umur_hari} hari
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-3">
                    {awet.cocok_karena}
                  </p>
                </div>

                {awet.langkah_singkat && awet.langkah_singkat.length > 0 && (
                  <ol className="text-xs text-ink/90 flex flex-col gap-1.5 pt-2 border-t border-black/[0.04]">
                    {awet.langkah_singkat.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="font-bold text-primary shrink-0">
                          {sIdx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6) Kotak Ajakan Simpan Hasil & Lacak Dampak (untuk Guest) */}
      {!isLoggedIn && (
        <div className="rounded-[32px] bg-primary-soft p-6 sm:p-8 text-center mt-4 border border-primary/10 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mx-auto mb-3 shadow-xs">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-xl sm:text-2xl text-ink mb-2">
            Mau simpan hasil & lacak dampakmu?
          </h4>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
            Daftar gratis untuk mencatat bahan yang terselamatkan dan memantau skor kebaikan dapurmu.
          </p>
          <Button variant="primary" size="lg" href="/daftar" className="px-8 shadow-sm">
            Daftar Gratis
          </Button>
        </div>
      )}

      {/* ChefChat: tampilkan hanya jika ada bahan aman/waspada */}
      {adaBahanAman && (
        <ChefChat
          konteks={{
            bahan: data.bahan.map((b) => ({
              nama: b.nama_standar,
              keamanan: b.keamanan.aman_dikonsumsi,
              sisa:
                b.umur_simpan.hari_min === 0 && b.umur_simpan.hari_maks === 0
                  ? "tidak layak disimpan"
                  : `${b.umur_simpan.hari_min}–${b.umur_simpan.hari_maks} hari`,
            })),
          }}
          daftarResep={(data.ide_olahan || []).map((ide) => ({
            nama: ide.nama,
            bahan_tambahan: ide.bahan_tambahan,
            langkah: ide.langkah,
          }))}
        />
      )}
    </div>
  );
};

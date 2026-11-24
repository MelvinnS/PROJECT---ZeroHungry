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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IdeOlahanCard } from "./IdeOlahanCard";
import { ChefChat } from "@/components/features/chef/ChefChat";
import type { HasilAnalisis as HasilAnalisisType, InputAnalisis } from "@/lib/schemas";

interface HasilAnalisisProps {
  data: HasilAnalisisType;
  inputPayload?: InputAnalisis | null;
  source: "live" | "fallback" | null;
  isLoggedIn?: boolean;
  onReset: () => void;
}

export const HasilAnalisis: React.FC<HasilAnalisisProps> = ({
  data,
  inputPayload,
  source,
  isLoggedIn = false,
  onReset,
}) => {
  // Hanya satu kartu accordion ide olahan yang terbuka sekali waktu
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const handleSimpanRiwayat = async () => {
    if (!inputPayload || saveStatus === "saving" || saveStatus === "saved") {
      return;
    }

    setSaveStatus("saving");
    setSaveErrorMessage(null);

    try {
      const res = await fetch("/api/riwayat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: inputPayload,
          hasil: data,
          source: source === "live" ? "live" : "fallback",
        }),
      });

      if (res.ok) {
        setSaveStatus("saved");
      } else {
        const errJson = await res.json().catch(() => null);
        console.error("Gagal menyimpan riwayat:", errJson);
        setSaveErrorMessage("Gagal menyimpan, coba lagi.");
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Error jaringan saat menyimpan riwayat:", err);
      setSaveErrorMessage("Gagal menyimpan, coba lagi.");
      setSaveStatus("error");
    }
  };

  const handleToggleCard = (index: number) => {
    setOpenCardIndex((prev) => (prev === index ? null : index));
  };

  const isTidakAman = data.keamanan.aman_dikonsumsi === "tidak_aman";
  const isWaspada = data.keamanan.aman_dikonsumsi === "waspada";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 text-left animate-fade-in pb-12">
      {/* 0) Baris Atas: Tombol Kembali & Info Sumber Hasil */}
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

          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface text-ink border border-black/[0.06]">
            Hasil: {data.bahan.nama_standar}
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

      {/* 1) Kartu Status Keamanan Pangan */}
      <div className="rounded-[24px] bg-white border border-black/[0.04] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Badge Status Keamanan */}
        <div className="flex items-center">
          {isTidakAman ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-rose-50 text-danger border border-rose-200">
              <XCircle className="w-5 h-5" />
              <span>Tidak Aman Dikonsumsi</span>
            </span>
          ) : isWaspada ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
              <span>Perlu Waspada</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-primary-soft text-primary border border-primary/20">
              <CheckCircle2 className="w-5 h-5" />
              <span>Aman Dikonsumsi</span>
            </span>
          )}
        </div>

        {/* Alasan Keamanan */}
        <p className="text-ink text-sm sm:text-base leading-relaxed mt-4">
          {data.keamanan.alasan}
        </p>

        {/* Catatan Tambahan (jika ada) */}
        {data.keamanan.catatan && (
          <div className="mt-3.5 p-3 rounded-xl bg-surface border border-black/[0.04] flex items-start gap-2.5 text-xs sm:text-sm text-muted">
            <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
            <span className="leading-relaxed">{data.keamanan.catatan}</span>
          </div>
        )}

        {/* Pembatas Garis Tipis */}
        <hr className="my-4 border-black/[0.06]" />

        {/* Sisa Umur Simpan & Tips Penyimpanan */}
        <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              {data.umur_simpan.hari_min === 0 && data.umur_simpan.hari_maks === 0
                ? "Tidak layak disimpan"
                : `Sisa umur simpan: ${data.umur_simpan.hari_min}–${data.umur_simpan.hari_maks} hari`}
            </span>
          </div>
          {data.umur_simpan.tips_penyimpanan && (
            <p className="text-muted text-xs sm:text-sm leading-relaxed pl-6">
              {data.umur_simpan.tips_penyimpanan}
            </p>
          )}
        </div>

        {/* Tombol Simpan ke Riwayat (Hanya jika pengguna login) */}
        {isLoggedIn && (
          <div className="mt-5 pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {saveStatus === "saved" ? (
              <div className="flex items-center flex-wrap gap-2.5">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary-soft text-primary border border-primary/20 opacity-90 cursor-default"
                >
                  <Check className="w-4 h-4" />
                  <span>Tersimpan</span>
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
                  disabled={saveStatus === "saving" || !inputPayload}
                  onClick={handleSimpanRiwayat}
                  className="inline-flex items-center gap-2 w-fit border-primary text-primary hover:bg-primary-soft"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>
                    {saveStatus === "saving" ? "Menyimpan…" : "Simpan ke Riwayat"}
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

      {/* 2) JIKA TIDAK AMAN: Tampilkan Kotak Larangan Konsumsi & Selesai */}
      {isTidakAman ? (
        <div className="rounded-[24px] bg-rose-50 border border-rose-200 p-6 sm:p-7 text-left flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-rose-950 font-medium leading-relaxed">
              Sebaiknya jangan diolah atau dikonsumsi. Buang dengan aman dan cuci tangan serta peralatan.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onReset}
            className="mt-2"
          >
            Analisis bahan lain
          </Button>
        </div>
      ) : (
        <>
          {/* 3) Bagian Ide Olahan */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xl sm:text-2xl text-ink">
                Ide Olahan
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {data.ide_olahan.length} RESEP PILIHAN
              </span>
            </div>

            {data.ide_olahan.length === 0 ? (
              <div className="p-6 rounded-[24px] bg-white border border-black/[0.04] text-center text-muted text-sm">
                Belum ada ide olahan untuk kondisi ini.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {data.ide_olahan.map((ide, idx) => (
                  <IdeOlahanCard
                    key={idx}
                    index={idx}
                    ide={ide}
                    isOpen={openCardIndex === idx}
                    onToggle={() => handleToggleCard(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4) Bagian Pengawetan (Hanya jika ada data pengawetan) */}
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

          {/* 5) Kotak Ajakan Simpan Hasil & Lacak Dampak */}
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
        </>
      )}

      {/* ChefChat: hanya jika bahan AMAN atau WASPADA */}
      {!isTidakAman && (
        <ChefChat
          konteks={{
            bahan: [
              {
                nama: data.bahan.nama_standar,
                keamanan: data.keamanan.aman_dikonsumsi,
                sisa:
                  data.umur_simpan.hari_min === 0 && data.umur_simpan.hari_maks === 0
                    ? "tidak layak disimpan"
                    : `${data.umur_simpan.hari_min}–${data.umur_simpan.hari_maks} hari`,
              },
            ],
          }}
          daftarResep={data.ide_olahan.map((ide) => ({
            nama: ide.nama,
            bahan_tambahan: ide.bahan_tambahan,
            langkah: ide.langkah,
          }))}
        />
      )}
    </div>
  );
};

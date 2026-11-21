"use client";

import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  Scale,
  Leaf,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  type HasilKalkulator as HasilKalkulatorType,
  type InputKalkulator,
  formatRupiah,
  formatKg,
} from "@/lib/kalkulator";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BarChartSederhana } from "./BarChartSederhana";

interface HasilKalkulatorProps {
  hasil: HasilKalkulatorType;
  input: InputKalkulator;
  namaBahan?: string;
}

export const HasilKalkulator: React.FC<HasilKalkulatorProps> = ({
  hasil,
  input,
  namaBahan,
}) => {
  const {
    kgTerjualMentah,
    pendapatanMentah,
    untungMentah,
    hasilOlahanKg,
    pendapatanOlahan,
    biayaOlahTotal,
    untungOlahan,
    selisih,
    rekomendasi,
    bepKg,
    hargaOlahanImpas,
    limbahDicegahKg,
  } = hasil;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Header Khusus Versi Cetak (Hanya tampil saat print) */}
      <div className="hidden print:block border-b border-black/10 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-ink">
          Ringkasan Kalkulator Mentah vs Olahan
        </h2>
        <div className="mt-2 text-sm text-muted flex flex-wrap gap-x-6 gap-y-1">
          {namaBahan && (
            <p>
              Bahan: <strong className="text-ink">{namaBahan}</strong>
            </p>
          )}
          <p>
            Tanggal: <strong className="text-ink">{currentDateFormatted}</strong>
          </p>
          <p>
            Jumlah Bahan:{" "}
            <strong className="text-ink">{formatKg(input.jumlahKg)} kg</strong>
          </p>
        </div>
        <p className="text-xs text-muted mt-1 italic">
          Dihitung dengan Dari Sisa Jadi Nilai
        </p>
      </div>

      {/* 1. BANNER REKOMENDASI BESAR */}
      {rekomendasi === "olah" && (
        <div className="rounded-2xl p-5 sm:p-6 bg-emerald-50 border border-emerald-200/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1B6B3A] shrink-0">
            <TrendingUp className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B6B3A]">
              Rekomendasi
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-950 mt-0.5">
              Olah dulu: untung lebih besar {formatRupiah(selisih)}
            </h3>
            <p className="text-sm text-emerald-800/90 mt-1">
              Dengan mengolah bahan menjadi produk bernilai tambah, margin
              keuntunganmu jauh lebih tinggi dibandingkan menjualnya langsung
              dalam kondisi mentah.
            </p>
          </div>
        </div>
      )}

      {rekomendasi === "jual_mentah" && (
        <div className="rounded-2xl p-5 sm:p-6 bg-amber-50 border border-amber-200/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Rekomendasi
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950 mt-0.5">
              Jual mentah lebih menguntungkan {formatRupiah(Math.abs(selisih))}{" "}
              pada harga ini
            </h3>
            <p className="text-sm text-amber-900/90 mt-1">
              Biaya pengolahan belum tertutup oleh harga jual olahan saat ini.
              Pertimbangkan untuk menaikkan harga jual produk olahan atau
              menekan biaya operasional per batch.
            </p>
          </div>
        </div>
      )}

      {rekomendasi === "setara" && (
        <div className="rounded-2xl p-5 sm:p-6 bg-slate-100 border border-slate-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Scale className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Rekomendasi
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Keduanya menghasilkan untung yang sama
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Keuntungan bersih skenario jual mentah dan olah dulu bernilai
              setara pada parameter input ini.
            </p>
          </div>
        </div>
      )}

      {/* 2. DUA KARTU BERDAMPINGAN: JUAL MENTAH VS OLAH DULU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kartu Jual Mentah */}
        <Card
          className={`p-6 border transition-all relative ${
            rekomendasi === "jual_mentah"
              ? "border-[#1B6B3A]/40 ring-2 ring-[#1B6B3A]/10 bg-white"
              : "border-black/[0.06] bg-surface"
          }`}
        >
          {rekomendasi === "jual_mentah" && (
            <div className="absolute top-4 right-4">
              <Badge variant="primary">Lebih untung</Badge>
            </div>
          )}
          <h4 className="text-base font-bold text-ink mb-4">Jual Mentah</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-muted">
              <span>Bahan terjual</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatKg(kgTerjualMentah)} kg
              </span>
            </div>
            <div className="flex justify-between items-center text-muted">
              <span>Pendapatan</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatRupiah(pendapatanMentah)}
              </span>
            </div>
            <div className="border-t border-black/[0.06] pt-3 mt-3">
              <span className="text-xs text-muted block mb-1">Untung Bersih</span>
              <p
                className={`text-2xl font-extrabold tracking-tight tabular-nums break-words ${
                  untungMentah < 0 ? "text-rose-600" : "text-ink"
                }`}
              >
                {formatRupiah(untungMentah)}
              </p>
            </div>
          </div>
        </Card>

        {/* Kartu Olah Dulu */}
        <Card
          className={`p-6 border transition-all relative ${
            rekomendasi === "olah"
              ? "border-[#1B6B3A]/40 ring-2 ring-[#1B6B3A]/10 bg-white"
              : "border-black/[0.06] bg-surface"
          }`}
        >
          {rekomendasi === "olah" && (
            <div className="absolute top-4 right-4">
              <Badge variant="primary">Lebih untung</Badge>
            </div>
          )}
          <h4 className="text-base font-bold text-ink mb-4">Olah Dulu</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-muted">
              <span>Hasil olahan</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatKg(hasilOlahanKg)} kg
              </span>
            </div>
            <div className="flex justify-between items-center text-muted">
              <span>Pendapatan</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatRupiah(pendapatanOlahan)}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted">
              <span>Biaya olah total</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatRupiah(biayaOlahTotal)}
              </span>
            </div>
            <div className="border-t border-black/[0.06] pt-3 mt-3">
              <span className="text-xs text-muted block mb-1">Untung Bersih</span>
              <p
                className={`text-2xl font-extrabold tracking-tight tabular-nums break-words ${
                  untungOlahan < 0 ? "text-rose-600" : "text-[#1B6B3A]"
                }`}
              >
                {formatRupiah(untungOlahan)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. GRAFIK BATANG (BarChartSederhana) */}
      <BarChartSederhana
        untungMentah={untungMentah}
        untungOlahan={untungOlahan}
      />

      {/* 4. KARTU TITIK IMPAS */}
      <Card className="p-6 border border-black/[0.06] bg-white">
        <h4 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Analisis Titik Impas (Break-Even)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          {/* Poin A: BEP Bahan */}
          <div className="p-4 rounded-2xl bg-surface border border-black/[0.04]">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
              Minimal Bahan Mentah
            </span>
            {bepKg === null ? (
              <div>
                <p className="font-bold text-ink">Tidak tercapai pada harga ini</p>
                <p className="text-xs text-muted mt-1">
                  Coba naikkan harga jual produk olahan atau turunkan biaya
                  pengolahan per kg.
                </p>
              </div>
            ) : bepKg === 0 ? (
              <div>
                <p className="font-bold text-[#1B6B3A]">
                  Sudah menguntungkan sejak kg pertama
                </p>
                <p className="text-xs text-muted mt-1">
                  Tidak ada beban biaya tetap yang harus dikejar.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-extrabold text-ink tabular-nums">
                  {bepKg} kg
                </p>
                <p className="text-xs text-muted mt-1">
                  {input.jumlahKg >= bepKg
                    ? `Jumlah bahan saat ini (${formatKg(
                        input.jumlahKg
                      )} kg) sudah melewati titik impas.`
                    : `Jumlah bahan saat ini (${formatKg(
                        input.jumlahKg
                      )} kg) belum mencapai titik impas (${bepKg} kg).`}
                </p>
              </div>
            )}
          </div>

          {/* Poin B: Harga Olahan Impas */}
          <div className="p-4 rounded-2xl bg-surface border border-black/[0.04]">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
              Harga Olahan Minimum
            </span>
            {hargaOlahanImpas !== null ? (
              <div>
                <p className="text-xl font-extrabold text-ink tabular-nums">
                  {formatRupiah(hargaOlahanImpas)} /kg hasil
                </p>
                <p className="text-xs text-muted mt-1">
                  Harga olahan minimal agar untung olah sama dengan jual mentah.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted">Data bahan olahan tidak valid.</p>
            )}
          </div>
        </div>
      </Card>

      {/* 5. KARTU DAMPAK */}
      {rekomendasi === "olah" && limbahDicegahKg > 0 && (
        <Card className="p-6 border border-emerald-100 bg-emerald-50/50">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1B6B3A] shrink-0">
              <Leaf className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-base font-bold text-ink">Dampak Lingkungan</h4>
              <p className="text-sm font-semibold text-[#1B6B3A] mt-1">
                Dengan mengolah, kamu mencegah {formatKg(limbahDicegahKg)} kg
                bahan terbuang.
              </p>
              <p className="text-xs text-muted mt-1">
                Angka ini perkiraan berdasarkan persen susut yang kamu isi.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 6. TOMBOL SIMPAN SEBAGAI PDF */}
      <div className="flex items-center justify-between pt-2 no-print">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Simpan sebagai PDF</span>
        </Button>
      </div>

      {/* 7. CATATAN TEKS KECIL MUTED */}
      <p className="text-xs text-muted italic text-center sm:text-left">
        Perhitungan ini perkiraan untuk membantu keputusan, bukan laporan
        keuangan.
      </p>
    </div>
  );
};

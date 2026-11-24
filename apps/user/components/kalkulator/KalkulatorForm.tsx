"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import {
  type InputKalkulator,
  type ErrorValidasiKalkulator,
} from "@/lib/kalkulator";
import { Button } from "@/components/ui/Button";

export type FormState = {
  namaBahan: string;
  jumlahKg: string;
  hargaMentahPerKg: string;
  susutPersen: string;
  biayaOlahPerKg: string;
  rendemenPersen: string;
  hargaOlahanPerKg: string;
  biayaTetap: string;
};

interface KalkulatorFormProps {
  formValues: FormState;
  errors: ErrorValidasiKalkulator;
  touched: Record<string, boolean>;
  onChangeField: (field: keyof FormState, rawValue: string) => void;
  onBlurField: (field: keyof FormState) => void;
  onApplyPreset: (preset: {
    namaBahan: string;
    input: InputKalkulator;
  }) => void;
  onReset: () => void;
}

const PRESETS = [
  {
    label: "Singkong → Keripik",
    namaBahan: "Singkong",
    input: {
      jumlahKg: 100,
      hargaMentahPerKg: 3000,
      susutPersen: 20,
      biayaOlahPerKg: 2000,
      rendemenPersen: 30,
      hargaOlahanPerKg: 25000,
      biayaTetap: 200000,
    },
  },
  {
    label: "Pisang → Keripik Pisang",
    namaBahan: "Pisang",
    input: {
      jumlahKg: 50,
      hargaMentahPerKg: 8000,
      susutPersen: 25,
      biayaOlahPerKg: 6000,
      rendemenPersen: 25,
      hargaOlahanPerKg: 60000,
      biayaTetap: 150000,
    },
  },
  {
    label: "Tempe → Keripik Tempe",
    namaBahan: "Tempe",
    input: {
      jumlahKg: 30,
      hargaMentahPerKg: 12000,
      susutPersen: 15,
      biayaOlahPerKg: 7000,
      rendemenPersen: 40,
      hargaOlahanPerKg: 50000,
      biayaTetap: 100000,
    },
  },
];

export const KalkulatorForm: React.FC<KalkulatorFormProps> = ({
  formValues,
  errors,
  touched,
  onChangeField,
  onBlurField,
  onApplyPreset,
  onReset,
}) => {
  // Format pemisah ribuan Rupiah saat diketik
  const handleRupiahChange = (
    field: keyof FormState,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    if (!rawDigits) {
      onChangeField(field, "");
      return;
    }
    const num = parseInt(rawDigits, 10);
    onChangeField(field, num.toLocaleString("id-ID"));
  };

  // Format angka desimal biasa (jumlah kg, persentase)
  const handleDecimalChange = (
    field: keyof FormState,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value.replace(/[^0-9.,]/g, "");
    onChangeField(field, val);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm">
      {/* Baris Coba Contoh */}
      <div className="mb-6 pb-6 border-b border-black/[0.06] no-print">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
          Coba Contoh
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold bg-surface hover:bg-primary-soft text-ink hover:text-primary border border-black/[0.08] hover:border-primary/30 transition-all select-none"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-5">
        {/* Nama Bahan */}
        <div>
          <label
            htmlFor="namaBahan"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Nama bahan (opsional)
          </label>
          <input
            id="namaBahan"
            type="text"
            value={formValues.namaBahan}
            onChange={(e) => onChangeField("namaBahan", e.target.value)}
            placeholder="Contoh: Singkong Manis"
            className="w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/60 transition-all border border-transparent focus:border-primary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Jumlah Bahan (kg) */}
        <div>
          <label
            htmlFor="jumlahKg"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Jumlah bahan (kg) <span className="text-rose-500">*</span>
          </label>
          <input
            id="jumlahKg"
            type="text"
            inputMode="decimal"
            value={formValues.jumlahKg}
            onChange={(e) => handleDecimalChange("jumlahKg", e)}
            onBlur={() => onBlurField("jumlahKg")}
            aria-describedby={
              touched.jumlahKg && errors.jumlahKg ? "jumlahKg-error" : undefined
            }
            placeholder="Contoh: 100"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.jumlahKg && errors.jumlahKg
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.jumlahKg && errors.jumlahKg && (
            <p id="jumlahKg-error" className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.jumlahKg}
            </p>
          )}
        </div>

        {/* Harga Jual Mentah (Rp/kg) */}
        <div>
          <label
            htmlFor="hargaMentahPerKg"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Harga jual mentah (Rp/kg) <span className="text-rose-500">*</span>
          </label>
          <input
            id="hargaMentahPerKg"
            type="text"
            inputMode="decimal"
            value={formValues.hargaMentahPerKg}
            onChange={(e) => handleRupiahChange("hargaMentahPerKg", e)}
            onBlur={() => onBlurField("hargaMentahPerKg")}
            aria-describedby={
              touched.hargaMentahPerKg && errors.hargaMentahPerKg
                ? "hargaMentahPerKg-error"
                : undefined
            }
            placeholder="Contoh: 3.000"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.hargaMentahPerKg && errors.hargaMentahPerKg
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.hargaMentahPerKg && errors.hargaMentahPerKg && (
            <p
              id="hargaMentahPerKg-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.hargaMentahPerKg}
            </p>
          )}
        </div>

        {/* Susut Persen (%) */}
        <div>
          <label
            htmlFor="susutPersen"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Perkiraan bahan terbuang bila dijual mentah (%) <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-muted mb-1.5">
            Karena rusak atau tidak laku
          </p>
          <input
            id="susutPersen"
            type="text"
            inputMode="decimal"
            value={formValues.susutPersen}
            onChange={(e) => handleDecimalChange("susutPersen", e)}
            onBlur={() => onBlurField("susutPersen")}
            aria-describedby={
              touched.susutPersen && errors.susutPersen
                ? "susutPersen-error"
                : undefined
            }
            placeholder="Contoh: 20"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.susutPersen && errors.susutPersen
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.susutPersen && errors.susutPersen && (
            <p
              id="susutPersen-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.susutPersen}
            </p>
          )}
        </div>

        {/* Biaya Olah Per Kg Bahan (Rp) */}
        <div>
          <label
            htmlFor="biayaOlahPerKg"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Biaya olah per kg bahan (Rp) <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-muted mb-1.5">
            Bumbu, minyak, gas, tenaga
          </p>
          <input
            id="biayaOlahPerKg"
            type="text"
            inputMode="decimal"
            value={formValues.biayaOlahPerKg}
            onChange={(e) => handleRupiahChange("biayaOlahPerKg", e)}
            onBlur={() => onBlurField("biayaOlahPerKg")}
            aria-describedby={
              touched.biayaOlahPerKg && errors.biayaOlahPerKg
                ? "biayaOlahPerKg-error"
                : undefined
            }
            placeholder="Contoh: 2.000"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.biayaOlahPerKg && errors.biayaOlahPerKg
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.biayaOlahPerKg && errors.biayaOlahPerKg && (
            <p
              id="biayaOlahPerKg-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.biayaOlahPerKg}
            </p>
          )}
        </div>

        {/* Rendemen Persen (%) */}
        <div>
          <label
            htmlFor="rendemenPersen"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Hasil olahan dari bahan mentah (%) <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-muted mb-1.5">
            Rendemen: 100 kg singkong bisa jadi 30 kg keripik = 30%
          </p>
          <input
            id="rendemenPersen"
            type="text"
            inputMode="decimal"
            value={formValues.rendemenPersen}
            onChange={(e) => handleDecimalChange("rendemenPersen", e)}
            onBlur={() => onBlurField("rendemenPersen")}
            aria-describedby={
              touched.rendemenPersen && errors.rendemenPersen
                ? "rendemenPersen-error"
                : undefined
            }
            placeholder="Contoh: 30"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.rendemenPersen && errors.rendemenPersen
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.rendemenPersen && errors.rendemenPersen && (
            <p
              id="rendemenPersen-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.rendemenPersen}
            </p>
          )}
        </div>

        {/* Harga Jual Olahan (Rp/kg hasil) */}
        <div>
          <label
            htmlFor="hargaOlahanPerKg"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Harga jual olahan (Rp/kg hasil) <span className="text-rose-500">*</span>
          </label>
          <input
            id="hargaOlahanPerKg"
            type="text"
            inputMode="decimal"
            value={formValues.hargaOlahanPerKg}
            onChange={(e) => handleRupiahChange("hargaOlahanPerKg", e)}
            onBlur={() => onBlurField("hargaOlahanPerKg")}
            aria-describedby={
              touched.hargaOlahanPerKg && errors.hargaOlahanPerKg
                ? "hargaOlahanPerKg-error"
                : undefined
            }
            placeholder="Contoh: 25.000"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.hargaOlahanPerKg && errors.hargaOlahanPerKg
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.hargaOlahanPerKg && errors.hargaOlahanPerKg && (
            <p
              id="hargaOlahanPerKg-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.hargaOlahanPerKg}
            </p>
          )}
        </div>

        {/* Biaya Tetap per Batch (Rp) */}
        <div>
          <label
            htmlFor="biayaTetap"
            className="block text-sm font-semibold text-ink mb-1"
          >
            Biaya tetap per batch (Rp) <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-muted mb-1.5">
            Kemasan, sewa alat, dll. Isi 0 jika tidak ada
          </p>
          <input
            id="biayaTetap"
            type="text"
            inputMode="decimal"
            value={formValues.biayaTetap}
            onChange={(e) => handleRupiahChange("biayaTetap", e)}
            onBlur={() => onBlurField("biayaTetap")}
            aria-describedby={
              touched.biayaTetap && errors.biayaTetap
                ? "biayaTetap-error"
                : undefined
            }
            placeholder="Contoh: 200.000"
            className={`w-full min-h-[44px] rounded-2xl bg-surface px-4 py-3 text-base text-ink tabular-nums transition-all border ${
              touched.biayaTetap && errors.biayaTetap
                ? "border-rose-400 focus:ring-rose-200"
                : "border-transparent focus:border-primary/20 focus:ring-primary/20"
            } focus:bg-white focus:outline-none focus:ring-2`}
          />
          {touched.biayaTetap && errors.biayaTetap && (
            <p
              id="biayaTetap-error"
              className="mt-1.5 text-xs text-rose-600 font-medium"
            >
              {errors.biayaTetap}
            </p>
          )}
        </div>

        {/* Tombol Reset */}
        <div className="pt-2 no-print">
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            onClick={onReset}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

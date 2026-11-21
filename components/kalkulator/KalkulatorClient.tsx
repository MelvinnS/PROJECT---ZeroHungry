"use client";

import React, { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import {
  type InputKalkulator,
  type HasilKalkulator as HasilKalkulatorType,
  hitungKalkulator,
  validasiInput,
  type ErrorValidasiKalkulator,
} from "@/lib/kalkulator";
import {
  KalkulatorForm,
  type FormState,
} from "./KalkulatorForm";
import { HasilKalkulator } from "./HasilKalkulator";

const INITIAL_FORM_STATE: FormState = {
  namaBahan: "",
  jumlahKg: "",
  hargaMentahPerKg: "",
  susutPersen: "",
  biayaOlahPerKg: "",
  rendemenPersen: "",
  hargaOlahanPerKg: "",
  biayaTetap: "",
};

// Helper konversi string ke angka
function parseRupiahStr(str: string): number | undefined {
  if (!str.trim()) return undefined;
  const digits = str.replace(/\D/g, "");
  if (!digits) return undefined;
  return parseInt(digits, 10);
}

function parseDecimalStr(str: string): number | undefined {
  if (!str.trim()) return undefined;
  const normalized = str.replace(",", ".");
  const num = parseFloat(normalized);
  if (isNaN(num)) return undefined;
  return num;
}

export const KalkulatorClient: React.FC = () => {
  const [formValues, setFormValues] = useState<FormState>(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Parse form values ke InputKalkulator
  const parsedInput: Partial<InputKalkulator> = useMemo(() => {
    return {
      jumlahKg: parseDecimalStr(formValues.jumlahKg),
      hargaMentahPerKg: parseRupiahStr(formValues.hargaMentahPerKg),
      susutPersen: parseDecimalStr(formValues.susutPersen),
      biayaOlahPerKg: parseRupiahStr(formValues.biayaOlahPerKg),
      rendemenPersen: parseDecimalStr(formValues.rendemenPersen),
      hargaOlahanPerKg: parseRupiahStr(formValues.hargaOlahanPerKg),
      biayaTetap: parseRupiahStr(formValues.biayaTetap),
    };
  }, [formValues]);

  // Validasi input
  const errors: ErrorValidasiKalkulator = useMemo(() => {
    return validasiInput(parsedInput);
  }, [parsedInput]);

  // Hitung hasil secara LIVE jika semua field wajib valid
  const hasil: HasilKalkulatorType | null = useMemo(() => {
    const isAllFilled =
      parsedInput.jumlahKg !== undefined &&
      parsedInput.hargaMentahPerKg !== undefined &&
      parsedInput.susutPersen !== undefined &&
      parsedInput.biayaOlahPerKg !== undefined &&
      parsedInput.rendemenPersen !== undefined &&
      parsedInput.hargaOlahanPerKg !== undefined &&
      parsedInput.biayaTetap !== undefined;

    const hasErrors = Object.keys(errors).length > 0;

    if (isAllFilled && !hasErrors) {
      return hitungKalkulator(parsedInput as InputKalkulator);
    }
    return null;
  }, [parsedInput, errors]);

  const handleChangeField = (field: keyof FormState, rawValue: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: rawValue,
    }));
  };

  const handleBlurField = (field: keyof FormState) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleApplyPreset = (preset: {
    namaBahan: string;
    input: InputKalkulator;
  }) => {
    setFormValues({
      namaBahan: preset.namaBahan,
      jumlahKg: String(preset.input.jumlahKg),
      hargaMentahPerKg: preset.input.hargaMentahPerKg.toLocaleString("id-ID"),
      susutPersen: String(preset.input.susutPersen),
      biayaOlahPerKg: preset.input.biayaOlahPerKg.toLocaleString("id-ID"),
      rendemenPersen: String(preset.input.rendemenPersen),
      hargaOlahanPerKg: preset.input.hargaOlahanPerKg.toLocaleString("id-ID"),
      biayaTetap: preset.input.biayaTetap.toLocaleString("id-ID"),
    });
    // Reset touched agar tidak ada sisa error
    setTouched({});
  };

  const handleReset = () => {
    setFormValues(INITIAL_FORM_STATE);
    setTouched({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Cetak Media CSS Style */}
      <style jsx global>{`
        @media print {
          header,
          footer,
          nav,
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Header Halaman */}
      <div className="mb-8 md:mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
          Kalkulator Mentah vs Olahan
        </h1>
        <p className="text-muted mt-2 text-base sm:text-lg">
          Bandingkan untung jual langsung dengan mengolahnya dulu.
        </p>
      </div>

      {/* Grid Dua Kolom (Desktop lg: dua kolom, form kiri lebih sempit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Form (Kiri, 5 kolom dari 12) */}
        <div className="lg:col-span-5 no-print">
          <KalkulatorForm
            formValues={formValues}
            errors={errors}
            touched={touched}
            onChangeField={handleChangeField}
            onBlurField={handleBlurField}
            onApplyPreset={handleApplyPreset}
            onReset={handleReset}
          />
        </div>

        {/* Kolom Hasil (Kanan, 7 kolom dari 12) */}
        <div className="lg:col-span-7 print-full-width">
          {hasil && parsedInput.jumlahKg ? (
            <HasilKalkulator
              hasil={hasil}
              input={parsedInput as InputKalkulator}
              namaBahan={formValues.namaBahan.trim() || undefined}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/[0.06] shadow-sm text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center text-primary mb-4">
                <Calculator className="w-8 h-8" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-ink mb-1">
                Belum Ada Perhitungan
              </h2>
              <p className="text-sm text-muted max-w-sm">
                Isi data di samping atau pilih contoh untuk melihat hasil.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

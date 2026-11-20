"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  Flame,
  Square,
  Wind,
  Disc,
  Utensils,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { InputAnalisis } from "@/lib/schemas";

export interface FormValues {
  nama: string;
  jumlah: number;
  satuan: "kg" | "gram" | "buah" | "porsi" | "liter" | "ikat";
  kondisiPilihan: "segar" | "layu" | "rusak";
  kondisiDetail: string;
  alat: string[];
}

interface AnalisisFormProps {
  initialValues: FormValues;
  onSubmit: (payload: InputAnalisis, formState: FormValues) => void;
  isLoading: boolean;
  serverError: string | null;
}

const KONDISI_OPTIONS = [
  {
    id: "segar",
    label: "Masih segar",
    deskripsi: "Masih segar, belum ada tanda kerusakan",
  },
  {
    id: "layu",
    label: "Mulai layu / matang berlebih",
    deskripsi: "Mulai layu atau matang berlebih, belum berjamur atau berbau busuk",
  },
  {
    id: "rusak",
    label: "Sudah ada tanda rusak",
    deskripsi: "Sudah ada tanda rusak",
  },
] as const;

const ALAT_OPTIONS = [
  { id: "kompor", label: "Kompor", icon: Flame },
  { id: "oven", label: "Oven", icon: Square },
  { id: "air_fryer", label: "Air Fryer", icon: Wind },
  { id: "blender", label: "Blender", icon: Disc },
  { id: "kukusan", label: "Kukusan", icon: Utensils },
] as const;

const QUICK_TAGS = ["Berjamur", "Berbau busuk", "Berlendir"];

export const AnalisisForm: React.FC<AnalisisFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  serverError,
}) => {
  const [nama, setNama] = useState(initialValues.nama);
  const [jumlah, setJumlah] = useState<number>(initialValues.jumlah);
  const [satuan, setSatuan] = useState<FormValues["satuan"]>(initialValues.satuan);
  const [kondisiPilihan, setKondisiPilihan] = useState<FormValues["kondisiPilihan"]>(
    initialValues.kondisiPilihan
  );
  const [kondisiDetail, setKondisiDetail] = useState(initialValues.kondisiDetail);
  const [alat, setAlat] = useState<string[]>(initialValues.alat);

  // Field error validation
  const [errors, setErrors] = useState<{
    nama?: string;
    jumlah?: string;
    kondisiDetail?: string;
  }>({});

  // Refs untuk auto-fokus ke error pertama
  const namaRef = useRef<HTMLInputElement>(null);
  const jumlahRef = useRef<HTMLInputElement>(null);
  const kondisiDetailRef = useRef<HTMLTextAreaElement>(null);

  // Toggle pilihan alat dapur
  const toggleAlat = (alatId: string) => {
    setAlat((prev) =>
      prev.includes(alatId)
        ? prev.filter((id) => id !== alatId)
        : [...prev, alatId]
    );
  };

  // Tambah kata cepat ke textarea tanda rusak tanpa duplikasi
  const handleAddQuickTag = (tag: string) => {
    const trimmedCurrent = kondisiDetail.trim();
    if (!trimmedCurrent) {
      setKondisiDetail(tag);
      return;
    }

    // Cek apakah kata sudah ada di textarea
    const regex = new RegExp(`\\b${tag}\\b`, "i");
    if (!regex.test(trimmedCurrent)) {
      setKondisiDetail(`${trimmedCurrent}, ${tag}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      nama?: string;
      jumlah?: string;
      kondisiDetail?: string;
    } = {};

    // Validasi Nama Bahan: 2 - 80 karakter
    const trimmedNama = nama.trim();
    if (!trimmedNama || trimmedNama.length < 2) {
      newErrors.nama = "Nama bahan minimal 2 karakter.";
    } else if (trimmedNama.length > 80) {
      newErrors.nama = "Nama bahan maksimal 80 karakter.";
    }

    // Validasi Jumlah: angka positif
    if (isNaN(jumlah) || jumlah <= 0) {
      newErrors.jumlah = "Jumlah harus lebih besar dari 0.";
    }

    // Validasi Kondisi Bahan
    let finalKondisiString = "";
    if (kondisiPilihan === "segar") {
      finalKondisiString = "Masih segar, belum ada tanda kerusakan";
    } else if (kondisiPilihan === "layu") {
      finalKondisiString = "Mulai layu atau matang berlebih, belum berjamur atau berbau busuk";
    } else {
      const trimmedDetail = kondisiDetail.trim();
      if (!trimmedDetail || trimmedDetail.length < 3) {
        newErrors.kondisiDetail = "Ceritakan tanda kerusakan minimal 3 karakter.";
      }
      finalKondisiString = `Sudah ada tanda rusak: ${trimmedDetail}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-focus ke field pertama yang salah
      if (newErrors.nama) {
        namaRef.current?.focus();
      } else if (newErrors.jumlah) {
        jumlahRef.current?.focus();
      } else if (newErrors.kondisiDetail) {
        kondisiDetailRef.current?.focus();
      }
      return;
    }

    // Bersihkan error jika valid
    setErrors({});

    // Susun payload sesuai kontrak API
    const finalAlat = alat.length > 0 ? alat : ["tanpa_alat"];
    const payload: InputAnalisis = {
      nama: trimmedNama,
      jumlah: Number(jumlah),
      satuan,
      kondisi: finalKondisiString,
      tipe: "rumah_tangga",
      alat: finalAlat as InputAnalisis["alat"],
    };

    const currentFormState: FormValues = {
      nama,
      jumlah,
      satuan,
      kondisiPilihan,
      kondisiDetail,
      alat,
    };

    onSubmit(payload, currentFormState);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] bg-white p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] text-left animate-fade-in">
      {/* Header Form */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Bahan apa yang tersisa?
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2">
          Ketahui cara mengolahnya jadi masakan bernilai dan aman.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Field 1: Nama Bahan */}
        <div>
          <Input
            ref={namaRef}
            id="nama-bahan"
            label="Nama Bahan"
            placeholder="contoh: pisang kepok"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (errors.nama) setErrors((prev) => ({ ...prev, nama: undefined }));
            }}
            error={errors.nama}
            maxLength={80}
            required
            aria-required="true"
            autoComplete="off"
          />
        </div>

        {/* Field 2: Jumlah & Takaran (2 kolom sejajar di semua viewport) */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Jumlah & Takaran
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                ref={jumlahRef}
                id="jumlah-bahan"
                type="number"
                min={0.1}
                step={0.1}
                value={isNaN(jumlah) ? "" : jumlah}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setJumlah(val);
                  if (errors.jumlah) setErrors((prev) => ({ ...prev, jumlah: undefined }));
                }}
                error={errors.jumlah}
                required
                aria-required="true"
                aria-label="Jumlah bahan"
              />
            </div>
            <div>
              <Select
                id="satuan-bahan"
                value={satuan}
                onChange={(e) => setSatuan(e.target.value as FormValues["satuan"])}
                options={[
                  { value: "kg", label: "kg" },
                  { value: "gram", label: "gram" },
                  { value: "buah", label: "buah" },
                  { value: "porsi", label: "porsi" },
                  { value: "liter", label: "liter" },
                  { value: "ikat", label: "ikat" },
                ]}
                aria-label="Satuan takaran"
              />
            </div>
          </div>
        </div>

        {/* Field 3: Kondisi Bahan (3 chip besar radio) */}
        <div>
          <label
            id="label-kondisi"
            className="block text-sm font-semibold text-ink mb-2"
          >
            Kondisi Bahan
          </label>
          <div
            role="radiogroup"
            aria-labelledby="label-kondisi"
            className="flex flex-col gap-2.5"
          >
            {KONDISI_OPTIONS.map((opt) => {
              const isSelected = kondisiPilihan === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setKondisiPilihan(opt.id);
                    if (errors.kondisiDetail) {
                      setErrors((prev) => ({ ...prev, kondisiDetail: undefined }));
                    }
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl flex items-center justify-between text-sm sm:text-base transition-all duration-200 cursor-pointer min-h-[48px] ${
                    isSelected
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "bg-surface text-ink hover:bg-black/[0.04] border border-transparent"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-field Textarea jika pilih "Sudah ada tanda rusak" */}
          {kondisiPilihan === "rusak" && (
            <div className="mt-3.5 p-4 rounded-2xl bg-surface border border-black/[0.04] animate-fade-in">
              <label
                htmlFor="kondisi-detail"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Ceritakan tandanya <span className="text-danger">*</span>
              </label>
              <textarea
                ref={kondisiDetailRef}
                id="kondisi-detail"
                rows={2}
                value={kondisiDetail}
                placeholder="contoh: berjamur, berbau busuk, berlendir"
                onChange={(e) => {
                  setKondisiDetail(e.target.value);
                  if (errors.kondisiDetail) {
                    setErrors((prev) => ({ ...prev, kondisiDetail: undefined }));
                  }
                }}
                className={`w-full rounded-xl bg-white px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 border border-black/[0.08] focus:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.kondisiDetail ? "border-danger focus:ring-danger/20" : ""
                }`}
              />
              {errors.kondisiDetail && (
                <p className="mt-1 text-xs text-danger font-medium">
                  {errors.kondisiDetail}
                </p>
              )}

              {/* 3 Chip Kecil Pengisi Cepat */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="text-xs text-muted font-medium">Pengisi cepat:</span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddQuickTag(tag)}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-ink border border-black/[0.08] hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-95"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Field 4: Alat Dapur yang Ada (Chip multi-pilih dengan ikon) */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Alat Dapur yang Ada
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ALAT_OPTIONS.map((item) => {
              const isSelected = alat.includes(item.id);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleAlat(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] ${
                    isSelected
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface text-ink hover:bg-black/[0.04] border border-black/[0.05]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kotak Error Server jika analisis gagal */}
        {serverError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-left text-xs sm:text-sm text-rose-950 animate-fade-in"
          >
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">
              {serverError}
            </div>
          </div>
        )}

        {/* Tombol Submit & Keterangan */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            className="shadow-sm hover:shadow"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>{isLoading ? "Menganalisis…" : "Analisis Sekarang"}</span>
          </Button>
          <span className="text-xs text-muted font-medium">
            Gratis tanpa daftar
          </span>
        </div>
      </form>
    </div>
  );
};

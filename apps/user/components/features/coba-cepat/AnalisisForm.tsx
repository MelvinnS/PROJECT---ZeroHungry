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
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { InputAnalisis } from "@/lib/schemas";
import type { InputMulti } from "@/lib/schemas-multi";

export interface ItemBahanForm {
  id: string;
  nama: string;
  jumlah: number;
  satuan: "kg" | "gram" | "buah" | "porsi" | "liter" | "ikat";
  kondisiPilihan: "segar" | "layu" | "rusak";
  kondisiDetail: string;
}

export interface FormValues {
  items: ItemBahanForm[];
  alat: string[];
}

export type AnalisisSubmitPayload =
  | { mode: "single"; payload: InputAnalisis }
  | { mode: "multi"; payload: InputMulti };

interface AnalisisFormProps {
  initialValues: FormValues;
  onSubmit: (submitData: AnalisisSubmitPayload, formState: FormValues) => void;
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

export const createDefaultBahanItem = (initialNama = ""): ItemBahanForm => ({
  id: Math.random().toString(36).substring(2, 9),
  nama: initialNama,
  jumlah: 1,
  satuan: "kg",
  kondisiPilihan: "segar",
  kondisiDetail: "",
});

export const AnalisisForm: React.FC<AnalisisFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  serverError,
}) => {
  const [items, setItems] = useState<ItemBahanForm[]>(
    initialValues.items.length > 0
      ? initialValues.items
      : [createDefaultBahanItem()]
  );
  const [alat, setAlat] = useState<string[]>(initialValues.alat);

  // Error per baris bahan: [id]: { nama?: string, jumlah?: string, kondisiDetail?: string }
  const [itemErrors, setItemErrors] = useState<
    Record<string, { nama?: string; jumlah?: string; kondisiDetail?: string }>
  >({});

  // Refs per item untuk auto-fokus ke error pertama
  const inputRefs = useRef<
    Record<
      string,
      {
        nama?: HTMLInputElement | null;
        jumlah?: HTMLInputElement | null;
        kondisiDetail?: HTMLTextAreaElement | null;
      }
    >
  >({});

  // Helper untuk update field satu item
  const updateItem = (
    id: string,
    field: keyof ItemBahanForm,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

    // Hapus error jika sedang diedit
    if (itemErrors[id]) {
      setItemErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined,
        },
      }));
    }
  };

  const handleTambahBahan = () => {
    if (items.length >= 5) return;
    setItems((prev) => [...prev, createDefaultBahanItem()]);
  };

  const handleHapusBahan = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setItemErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const toggleAlat = (alatId: string) => {
    setAlat((prev) =>
      prev.includes(alatId)
        ? prev.filter((id) => id !== alatId)
        : [...prev, alatId]
    );
  };

  const handleAddQuickTag = (itemId: string, tag: string) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;

    const trimmedCurrent = item.kondisiDetail.trim();
    if (!trimmedCurrent) {
      updateItem(itemId, "kondisiDetail", tag);
      return;
    }

    const regex = new RegExp(`\\b${tag}\\b`, "i");
    if (!regex.test(trimmedCurrent)) {
      updateItem(itemId, "kondisiDetail", `${trimmedCurrent}, ${tag}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItemErrors: Record<
      string,
      { nama?: string; jumlah?: string; kondisiDetail?: string }
    > = {};

    // Cek nama kembar
    const seenNames = new Map<string, string>(); // lowerNama -> itemId

    items.forEach((item) => {
      const errorsForItem: {
        nama?: string;
        jumlah?: string;
        kondisiDetail?: string;
      } = {};

      const trimmedNama = item.nama.trim();
      const lowerNama = trimmedNama.toLowerCase();

      // 1. Validasi Nama
      if (!trimmedNama || trimmedNama.length < 2) {
        errorsForItem.nama = "Nama bahan minimal 2 karakter.";
      } else if (trimmedNama.length > 80) {
        errorsForItem.nama = "Nama bahan maksimal 80 karakter.";
      } else if (seenNames.has(lowerNama)) {
        errorsForItem.nama = "Nama bahan tidak boleh kembar.";
      } else {
        seenNames.set(lowerNama, item.id);
      }

      // 2. Validasi Jumlah
      if (isNaN(item.jumlah) || item.jumlah <= 0) {
        errorsForItem.jumlah = "Jumlah harus lebih besar dari 0.";
      }

      // 3. Validasi Kondisi
      if (item.kondisiPilihan === "rusak") {
        const trimmedDetail = item.kondisiDetail.trim();
        if (!trimmedDetail || trimmedDetail.length < 3) {
          errorsForItem.kondisiDetail =
            "Ceritakan tanda kerusakan minimal 3 karakter.";
        }
      }

      if (Object.keys(errorsForItem).length > 0) {
        newItemErrors[item.id] = errorsForItem;
      }
    });

    if (Object.keys(newItemErrors).length > 0) {
      setItemErrors(newItemErrors);
      // Auto-fokus ke elemen pertama yang salah
      const firstErrorItemId = items.find((it) => newItemErrors[it.id])?.id;
      if (firstErrorItemId) {
        const itemErr = newItemErrors[firstErrorItemId];
        const refs = inputRefs.current[firstErrorItemId];
        if (itemErr.nama && refs?.nama) {
          refs.nama.focus();
        } else if (itemErr.jumlah && refs?.jumlah) {
          refs.jumlah.focus();
        } else if (itemErr.kondisiDetail && refs?.kondisiDetail) {
          refs.kondisiDetail.focus();
        }
      }
      return;
    }

    // Bersihkan error jika lolos validasi
    setItemErrors({});

    const finalAlat =
      alat.length > 0
        ? (alat as InputAnalisis["alat"])
        : (["tanpa_alat"] as InputAnalisis["alat"]);

    const currentFormState: FormValues = {
      items,
      alat,
    };

    if (items.length === 1) {
      // Mode 1 bahan: kirim persis ke POST /api/analisis
      const item = items[0];
      let finalKondisi = "";
      if (item.kondisiPilihan === "segar") {
        finalKondisi = "Masih segar, belum ada tanda kerusakan";
      } else if (item.kondisiPilihan === "layu") {
        finalKondisi =
          "Mulai layu atau matang berlebih, belum berjamur atau berbau busuk";
      } else {
        finalKondisi = `Sudah ada tanda rusak: ${item.kondisiDetail.trim()}`;
      }

      const payload: InputAnalisis = {
        nama: item.nama.trim(),
        jumlah: Number(item.jumlah),
        satuan: item.satuan,
        kondisi: finalKondisi,
        tipe: "rumah_tangga",
        alat: finalAlat,
      };

      onSubmit({ mode: "single", payload }, currentFormState);
    } else {
      // Mode 2+ bahan: kirim ke POST /api/analisis-multi
      const daftarBahan = items.map((item) => {
        let finalKondisi = "";
        if (item.kondisiPilihan === "segar") {
          finalKondisi = "Masih segar, belum ada tanda kerusakan";
        } else if (item.kondisiPilihan === "layu") {
          finalKondisi =
            "Mulai layu atau matang berlebih, belum berjamur atau berbau busuk";
        } else {
          finalKondisi = `Sudah ada tanda rusak: ${item.kondisiDetail.trim()}`;
        }

        return {
          nama: item.nama.trim(),
          jumlah: Number(item.jumlah),
          satuan: item.satuan,
          kondisi: finalKondisi,
        };
      });

      const payload: InputMulti = {
        bahan: daftarBahan,
        tipe: "rumah_tangga",
        alat: finalAlat,
      };

      onSubmit({ mode: "multi", payload }, currentFormState);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] bg-white p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] text-left animate-fade-in">
      {/* Header Form */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Bahan apa yang tersisa?
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2">
          Masukkan 1 hingga 5 bahan. Ketahui cara mengolahnya jadi masakan bernilai dan aman.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Bagian Bahan yang Tersisa */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ink">
              Bahan yang tersisa ({items.length}/5)
            </label>
          </div>

          {/* Daftar Baris Bahan */}
          <div className="flex flex-col gap-5">
            {items.map((item, index) => {
              const errs = itemErrors[item.id] || {};

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-surface border border-black/[0.04] flex flex-col gap-4 relative animate-fade-in"
                >
                  {/* Header baris bahan */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Bahan #{index + 1}
                    </span>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleHapusBahan(item.id)}
                        aria-label={`Hapus bahan ke-${index + 1}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-danger hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* 1. Nama Bahan */}
                  <div>
                    <Input
                      ref={(el) => {
                        if (!inputRefs.current[item.id]) {
                          inputRefs.current[item.id] = {};
                        }
                        inputRefs.current[item.id].nama = el;
                      }}
                      id={`nama-bahan-${item.id}`}
                      label="Nama Bahan"
                      placeholder="contoh: pisang kepok"
                      value={item.nama}
                      onChange={(e) =>
                        updateItem(item.id, "nama", e.target.value)
                      }
                      error={errs.nama}
                      maxLength={80}
                      required
                      aria-required="true"
                      autoComplete="off"
                    />
                  </div>

                  {/* 2. Jumlah & Takaran (2 kolom sejajar) */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-ink mb-1.5">
                      Jumlah & Takaran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          ref={(el) => {
                            if (!inputRefs.current[item.id]) {
                              inputRefs.current[item.id] = {};
                            }
                            inputRefs.current[item.id].jumlah = el;
                          }}
                          id={`jumlah-bahan-${item.id}`}
                          type="number"
                          min={0.1}
                          step={0.1}
                          value={isNaN(item.jumlah) ? "" : item.jumlah}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateItem(item.id, "jumlah", val);
                          }}
                          error={errs.jumlah}
                          required
                          aria-required="true"
                          aria-label={`Jumlah bahan ke-${index + 1}`}
                        />
                      </div>
                      <div>
                        <Select
                          id={`satuan-bahan-${item.id}`}
                          value={item.satuan}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "satuan",
                              e.target.value as ItemBahanForm["satuan"]
                            )
                          }
                          options={[
                            { value: "kg", label: "kg" },
                            { value: "gram", label: "gram" },
                            { value: "buah", label: "buah" },
                            { value: "porsi", label: "porsi" },
                            { value: "liter", label: "liter" },
                            { value: "ikat", label: "ikat" },
                          ]}
                          aria-label={`Satuan takaran bahan ke-${index + 1}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Kondisi Bahan (3 chip radio) */}
                  <div>
                    <label
                      id={`label-kondisi-${item.id}`}
                      className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
                    >
                      Kondisi Bahan
                    </label>
                    <div
                      role="radiogroup"
                      aria-labelledby={`label-kondisi-${item.id}`}
                      className="flex flex-col gap-2"
                    >
                      {KONDISI_OPTIONS.map((opt) => {
                        const isSelected = item.kondisiPilihan === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              updateItem(item.id, "kondisiPilihan", opt.id);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-all duration-200 cursor-pointer min-h-[44px] ${
                              isSelected
                                ? "bg-primary text-white font-semibold shadow-xs"
                                : "bg-white text-ink hover:bg-black/[0.04] border border-black/[0.06]"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sub-field Textarea jika pilih "Sudah ada tanda rusak" */}
                    {item.kondisiPilihan === "rusak" && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white border border-black/[0.06] animate-fade-in">
                        <label
                          htmlFor={`kondisi-detail-${item.id}`}
                          className="block text-xs font-semibold text-ink mb-1"
                        >
                          Ceritakan tandanya <span className="text-danger">*</span>
                        </label>
                        <textarea
                          ref={(el) => {
                            if (!inputRefs.current[item.id]) {
                              inputRefs.current[item.id] = {};
                            }
                            inputRefs.current[item.id].kondisiDetail = el;
                          }}
                          id={`kondisi-detail-${item.id}`}
                          rows={2}
                          value={item.kondisiDetail}
                          placeholder="contoh: berjamur, berbau busuk, berlendir"
                          onChange={(e) =>
                            updateItem(item.id, "kondisiDetail", e.target.value)
                          }
                          className={`w-full rounded-lg bg-surface px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/60 border border-black/[0.08] focus:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            errs.kondisiDetail
                              ? "border-danger focus:ring-danger/20"
                              : ""
                          }`}
                        />
                        {errs.kondisiDetail && (
                          <p className="mt-1 text-xs text-danger font-medium">
                            {errs.kondisiDetail}
                          </p>
                        )}

                        {/* Chip Pengisi Cepat */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[11px] text-muted font-medium">
                            Pengisi cepat:
                          </span>
                          {QUICK_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAddQuickTag(item.id, tag)}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface text-ink border border-black/[0.08] hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-95"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Tambah Bahan */}
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            disabled={items.length >= 5}
            onClick={handleTambahBahan}
            className="border-dashed border-2 border-primary/30 text-primary hover:bg-primary-soft hover:border-primary/50 transition-all font-semibold py-3"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>
              {items.length >= 5 ? "Maksimal 5 bahan" : "+ Tambah bahan"}
            </span>
          </Button>
        </div>

        {/* Alat Dapur yang Ada (Chip multi-pilih, satu untuk semua bahan) */}
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

        {/* Kotak Error Server */}
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

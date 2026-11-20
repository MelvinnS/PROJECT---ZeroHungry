"use client";

import React, { useState } from "react";
import { AnalisisForm, type FormValues } from "./AnalisisForm";
import { LoadingState } from "./LoadingState";
import { HasilAnalisis } from "./HasilAnalisis";
import type { HasilAnalisis as HasilAnalisisType, InputAnalisis } from "@/lib/schemas";

const DEFAULT_FORM_VALUES: FormValues = {
  nama: "",
  jumlah: 1,
  satuan: "kg",
  kondisiPilihan: "segar",
  kondisiDetail: "",
  alat: ["kompor"],
};

export const CobaCepatClient: React.FC = () => {
  const [tampilan, setTampilan] = useState<"form" | "loading" | "hasil">("form");
  const [formValues, setFormValues] = useState<FormValues>(DEFAULT_FORM_VALUES);
  const [hasil, setHasil] = useState<HasilAnalisisType | null>(null);
  const [source, setSource] = useState<"live" | "fallback" | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Smooth scroll ke atas dengan menghormati prefers-reduced-motion
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const handleSubmitForm = async (
    payload: InputAnalisis,
    currentFormState: FormValues
  ) => {
    setServerError(null);
    setFormValues(currentFormState);
    setTampilan("loading");
    scrollToTop();

    // Timeout klien 35 detik menggunakan AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 35000);

    try {
      const res = await fetch("/api/analisis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json().catch(() => null);

      if (res.ok && json && json.data) {
        setHasil(json.data as HasilAnalisisType);
        setSource(json.source || "fallback");
        setTampilan("hasil");
        scrollToTop();
      } else {
        // Respons status 400 atau error server
        console.error("Gagal melakukan analisis bahan:", json);
        setServerError(
          "Maaf, analisis belum berhasil. Periksa isian lalu coba lagi."
        );
        setTampilan("form");
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("Kesalahan jaringan atau timeout saat memanggil /api/analisis:", err);
      if (err instanceof Error && err.name === "AbortError") {
        setServerError("Waktu analisis habis. Silakan periksa koneksi lalu coba lagi.");
      } else {
        setServerError(
          "Maaf, analisis belum berhasil. Periksa isian lalu coba lagi."
        );
      }
      setTampilan("form");
    }
  };

  // Reset form untuk menganalisis bahan lain dari awal
  const handleReset = () => {
    setFormValues(DEFAULT_FORM_VALUES);
    setHasil(null);
    setSource(null);
    setServerError(null);
    setTampilan("form");
    scrollToTop();
  };

  return (
    <div className="w-full py-8 md:py-14 min-h-[calc(100vh-140px)] flex flex-col justify-center">
      {tampilan === "form" && (
        <AnalisisForm
          initialValues={formValues}
          onSubmit={handleSubmitForm}
          isLoading={false}
          serverError={serverError}
        />
      )}

      {tampilan === "loading" && <LoadingState />}

      {tampilan === "hasil" && hasil && (
        <HasilAnalisis
          data={hasil}
          source={source}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

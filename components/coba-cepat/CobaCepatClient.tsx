"use client";

import React, { useState } from "react";
import {
  AnalisisForm,
  type FormValues,
  type AnalisisSubmitPayload,
  createDefaultBahanItem,
} from "./AnalisisForm";
import { LoadingState } from "./LoadingState";
import { HasilAnalisis } from "./HasilAnalisis";
import { HasilMultiView } from "./HasilMultiView";
import type { HasilAnalisis as HasilAnalisisType, InputAnalisis } from "@/lib/schemas";
import type { HasilMulti, InputMulti } from "@/lib/schemas-multi";

interface CobaCepatClientProps {
  initialNama?: string;
  isLoggedIn?: boolean;
}

export const CobaCepatClient: React.FC<CobaCepatClientProps> = ({
  initialNama = "",
  isLoggedIn = false,
}) => {
  const formattedNama = initialNama
    ? initialNama.charAt(0).toUpperCase() + initialNama.slice(1)
    : "";

  const [tampilan, setTampilan] = useState<"form" | "loading" | "hasil">("form");
  const [formValues, setFormValues] = useState<FormValues>({
    items: [createDefaultBahanItem(formattedNama)],
    alat: ["kompor"],
  });

  const [lastMode, setLastMode] = useState<"single" | "multi">("single");
  const [submittedPayloadSingle, setSubmittedPayloadSingle] =
    useState<InputAnalisis | null>(null);
  const [submittedPayloadMulti, setSubmittedPayloadMulti] =
    useState<InputMulti | null>(null);

  const [hasilSingle, setHasilSingle] = useState<HasilAnalisisType | null>(null);
  const [hasilMulti, setHasilMulti] = useState<HasilMulti | null>(null);

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
    submitData: AnalisisSubmitPayload,
    currentFormState: FormValues
  ) => {
    setServerError(null);
    setFormValues(currentFormState);
    setLastMode(submitData.mode);
    setTampilan("loading");
    scrollToTop();

    // Timeout klien 65 detik menggunakan AbortController dengan pesan timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("TIMEOUT");
    }, 65000);

    const isSingle = submitData.mode === "single";
    const endpoint = isSingle ? "/api/analisis" : "/api/analisis-multi";
    const bodyPayload = submitData.payload;

    if (isSingle) {
      setSubmittedPayloadSingle(submitData.payload as InputAnalisis);
      setSubmittedPayloadMulti(null);
    } else {
      setSubmittedPayloadMulti(submitData.payload as InputMulti);
      setSubmittedPayloadSingle(null);
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json().catch(() => null);

      if (res.ok && json && json.data) {
        if (isSingle) {
          setHasilSingle(json.data as HasilAnalisisType);
          setHasilMulti(null);
        } else {
          setHasilMulti(json.data as HasilMulti);
          setHasilSingle(null);
        }
        setSource(json.source || "fallback");
        setTampilan("hasil");
        scrollToTop();
      } else {
        console.error("Gagal melakukan analisis bahan:", json);
        setServerError(
          "Maaf, analisis belum berhasil. Periksa isian lalu coba lagi."
        );
        setTampilan("form");
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        (err instanceof Error &&
          (err.name === "AbortError" ||
            err.message.toLowerCase().includes("aborted"))) ||
        controller.signal.aborted;

      if (isAbort) {
        console.warn("Permintaan analisis dibatalkan karena timeout.");
        setServerError(
          "Waktu analisis habis. Silakan periksa koneksi lalu coba lagi."
        );
      } else {
        console.error("Kesalahan jaringan saat memanggil endpoint analisis:", err);
        setServerError(
          "Maaf, analisis belum berhasil. Periksa isian lalu coba lagi."
        );
      }
      setTampilan("form");
    }
  };

  // Reset form untuk menganalisis bahan lain dari awal
  const handleReset = () => {
    setFormValues({
      items: [createDefaultBahanItem()],
      alat: ["kompor"],
    });
    setSubmittedPayloadSingle(null);
    setSubmittedPayloadMulti(null);
    setHasilSingle(null);
    setHasilMulti(null);
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

      {tampilan === "loading" && (
        <LoadingState isMulti={lastMode === "multi"} />
      )}

      {tampilan === "hasil" && hasilSingle && (
        <HasilAnalisis
          data={hasilSingle}
          inputPayload={submittedPayloadSingle}
          source={source}
          isLoggedIn={isLoggedIn}
          onReset={handleReset}
        />
      )}

      {tampilan === "hasil" && hasilMulti && (
        <HasilMultiView
          data={hasilMulti}
          inputPayload={submittedPayloadMulti}
          source={source}
          isLoggedIn={isLoggedIn}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const LOADING_MESSAGES_SINGLE = [
  "Memeriksa keamanan pangan…",
  "Menghitung sisa umur simpan…",
  "Meracik panduan pengawetan terbaik…",
  "Mencari ide olahan lezat dan hemat…",
  "Menyusun langkah resep yang praktis…",
];

const LOADING_MESSAGES_MULTI = [
  "Memeriksa keamanan tiap bahan pangan…",
  "Menghitung sisa umur simpan…",
  "Menggabungkan resep dari bahan yang aman…",
  "Meracik panduan pengawetan terbaik…",
  "Menyusun langkah resep praktis & hemat…",
];

interface LoadingStateProps {
  isMulti?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isMulti = false }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = isMulti ? LOADING_MESSAGES_MULTI : LOADING_MESSAGES_SINGLE;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-[32px] bg-white p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Animasi Daun Berputar Halus */}
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary animate-spin motion-reduce:animate-none" />
        <div className="transform transition-transform duration-700 motion-safe:hover:scale-110">
          <Logo size={44} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight mb-2">
        {isMulti ? "Sedang menganalisis bahan-bahan…" : "Sedang menganalisis bahan…"}
      </h2>

      <p className="text-muted text-sm sm:text-base font-medium h-6 transition-all duration-300">
        {messages[messageIndex]}
      </p>

      <div className="mt-8 flex items-center justify-center gap-1.5">
        {messages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === messageIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-black/[0.1] motion-reduce:bg-black/[0.2]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

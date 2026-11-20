import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const Hero: React.FC = () => {
  return (
    <section className="py-12 md:py-20 border-b border-black/[0.06] animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Kolom Kiri: Teks & Aksi */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
            <span className="block text-ink">Tidak ada yang sisa.</span>
            <span className="block text-primary">Semua punya nilai.</span>
          </h1>

          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            Ubah bahan sisa jadi makanan bernilai, aman dan mudah.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Button
              variant="primary"
              size="lg"
              href="/coba-cepat"
              className="w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              Coba Sekarang
            </Button>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center text-sm sm:text-base font-semibold text-ink hover:text-primary transition-colors min-h-[44px] py-2 text-center"
            >
              Lihat Olahan <span className="ml-1.5 font-sans">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Foto Makanan Utama */}
        <div className="w-full">
          <div className="relative w-full aspect-[4/3] max-h-[360px] lg:max-h-[480px] rounded-[32px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-black/[0.04]">
            <Image
              src="/images/hero-makanan-lokal.jpg"
              alt="Mangkuk keramik berisi olahan tempe goreng, tahu, tumis kangkung, nasi merah, dan sate di atas meja kayu dengan cahaya alami"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

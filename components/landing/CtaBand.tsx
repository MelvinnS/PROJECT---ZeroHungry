import React from "react";
import { Button } from "@/components/ui/Button";

export const CtaBand: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="w-full bg-primary text-white rounded-[32px] p-6 sm:p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
        {/* Teks Judul dan Subteks */}
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Punya bahan sisa hari ini?
          </h2>
          <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed">
            Segera olah jadi masakan nikmat sebelum rusak.
          </p>
        </div>

        {/* Tombol Aksi Putih Teks Hijau */}
        <div className="w-full md:w-auto shrink-0">
          <Button
            variant="white"
            size="lg"
            href="/coba-cepat"
            className="w-full md:w-auto font-bold px-8 shadow-sm hover:shadow"
          >
            Coba Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { ArrowLeft, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OlahanNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-primary flex items-center justify-center mb-5">
        <ChefHat className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-2">
        Resep Tidak Ditemukan
      </h1>
      <p className="text-muted text-sm sm:text-base max-w-md mb-8">
        Maaf, resep olahan pangan yang kamu cari tidak tersedia atau tautan
        mungkin salah.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md" href="/katalog">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Kembali ke Katalog</span>
        </Button>
        <Button variant="outline" size="md" href="/">
          Beranda
        </Button>
      </div>
    </div>
  );
}

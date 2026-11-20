import React from "react";
import { Button } from "@/components/ui/Button";

export default function KatalogPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-2xl mb-4">
        📖
      </div>
      <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">
        Katalog Olahan
      </h1>
      <p className="text-muted text-base max-w-md mb-8">
        Halaman ini sedang disiapkan.
      </p>
      <Button variant="primary" size="md" href="/">
        Kembali ke Beranda
      </Button>
    </div>
  );
}

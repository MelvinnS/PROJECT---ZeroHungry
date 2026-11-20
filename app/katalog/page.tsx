import React from "react";
import type { Metadata } from "next";
import { KatalogClient } from "@/components/katalog/KatalogClient";

export const metadata: Metadata = {
  title: "Katalog Olahan | Dari Sisa Jadi Nilai",
  description:
    "Kumpulan resep kreatif dan praktis untuk mengolah bahan pangan sisa rumah tangga menjadi hidangan bernilai.",
};

export default function KatalogPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <KatalogClient />
    </div>
  );
}

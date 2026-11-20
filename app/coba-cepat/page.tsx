import type { Metadata } from "next";
import { CobaCepatClient } from "@/components/coba-cepat/CobaCepatClient";

export const metadata: Metadata = {
  title: "Coba Cepat | Dari Sisa Jadi Nilai",
  description:
    "Cek kelayakan pangan sisa dapur dan dapatkan ide olahan lezat bernilai tinggi secara gratis tanpa daftar.",
};

export default function CobaCepatPage() {
  return <CobaCepatClient />;
}

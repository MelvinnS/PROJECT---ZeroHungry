import type { Metadata } from "next";
import { getCurrentUserProfile } from "@/lib/auth";
import { CobaCepatClient } from "@/components/coba-cepat/CobaCepatClient";

export const metadata: Metadata = {
  title: "Coba Cepat | Dari Sisa Jadi Nilai",
  description:
    "Cek kelayakan pangan sisa dapur dan dapatkan ide olahan lezat bernilai tinggi secara gratis tanpa daftar.",
};

interface CobaCepatPageProps {
  searchParams: Promise<{
    bahan?: string;
  }>;
}

export default async function CobaCepatPage({
  searchParams,
}: CobaCepatPageProps) {
  const [resolvedSearchParams, userProfile] = await Promise.all([
    searchParams,
    getCurrentUserProfile(),
  ]);
  const rawBahan = resolvedSearchParams?.bahan;
  const initialNama =
    typeof rawBahan === "string" ? rawBahan.trim().slice(0, 80) : "";

  return (
    <CobaCepatClient
      initialNama={initialNama}
      isLoggedIn={Boolean(userProfile)}
    />
  );
}

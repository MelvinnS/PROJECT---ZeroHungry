import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/services/auth";
import { getRiwayat } from "@/server/services/riwayat";
import { RiwayatClient } from "@/components/features/dashboard/RiwayatClient";

export const metadata: Metadata = {
  title: "Riwayat Analisis | Dari Sisa Jadi Nilai",
  description: "Semua bahan yang pernah kamu selamatkan.",
};

export default async function RiwayatPage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk?next=/dashboard/riwayat");
  }

  const riwayat = await getRiwayat({ limit: 100 });

  return <RiwayatClient riwayat={riwayat} />;
}

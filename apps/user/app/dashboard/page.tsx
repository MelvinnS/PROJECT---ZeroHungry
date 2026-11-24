import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { getRingkasan, getRiwayat } from "@/lib/riwayat";
import { DashboardView } from "@/components/features/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | Dari Sisa Jadi Nilai",
  description: "Pantau analitik penyelamatan pangan, skor dampak, dan riwayat analisis dapurmu.",
};

export default async function DashboardPage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk?next=/dashboard");
  }

  const [ringkasan, riwayat] = await Promise.all([
    getRingkasan(),
    getRiwayat({ limit: 20 }),
  ]);

  return (
    <DashboardView
      profil={user}
      ringkasan={ringkasan}
      riwayat={riwayat}
    />
  );
}

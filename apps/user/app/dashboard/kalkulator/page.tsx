import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { KalkulatorClient } from "@/components/features/kalkulator/KalkulatorClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Store, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkulator Mentah vs Olahan | Dari Sisa Jadi Nilai",
  description:
    "Bandingkan untung jual mentah langsung vs mengolahnya dulu untuk pelaku usaha pangan.",
};

export default async function KalkulatorPage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk?next=/dashboard/kalkulator");
  }

  // Hanya role "usaha" dan "admin" yang dapat mengakses kalkulator ini
  if (user.role !== "usaha" && user.role !== "admin") {
    return (
      <div className="py-12 md:py-16 max-w-lg mx-auto px-4">
        <Card className="p-8 text-center border border-black/[0.06] shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-4">
            <Store className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-ink mb-2">
            Kalkulator ini untuk Pelaku Usaha.
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Fitur perbandingan keuntungan mentah vs olahan dirancang khusus
            untuk UMKM dan produsen pangan. Akun rumah tangga tidak memiliki
            akses ke fitur ini.
          </p>
          <Button
            variant="primary"
            size="md"
            href="/dashboard"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Button>
        </Card>
      </div>
    );
  }

  return <KalkulatorClient />;
}

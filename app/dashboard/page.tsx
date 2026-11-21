import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Sparkles, ArrowRight, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Dari Sisa Jadi Nilai",
  description: "Dashboard akun Dari Sisa Jadi Nilai.",
};

export default async function DashboardPage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk?next=/dashboard");
  }

  // Format label peran pengguna
  let roleLabel = "Rumah Tangga";
  let badgeVariant: "primary" | "warning" | "success" = "primary";

  if (user.role === "usaha") {
    const details: string[] = ["Pelaku Usaha"];
    if (user.tipe_usaha) details.push(user.tipe_usaha);
    if (user.nama_usaha) details.push(user.nama_usaha);
    roleLabel = details.join(" · ");
    badgeVariant = "warning";
  } else if (user.role === "admin") {
    roleLabel = "Admin";
    badgeVariant = "success";
  }

  return (
    <div className="py-10 md:py-16 max-w-2xl mx-auto">
      <Card className="p-8 sm:p-10 border border-black/[0.06] shadow-card text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="mb-2">
              <Badge variant={badgeVariant} className="text-xs">
                {roleLabel}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Halo, {user.nama}
            </h1>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted-bg border border-black/[0.04] mb-8">
          <p className="text-sm text-muted">
            Dashboard sedang disiapkan. Pantau analitik pangan dan riwayat
            resepmu di sini pada pembaruan mendatang.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Button
            variant="primary"
            size="md"
            href="/coba-cepat"
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Coba Analisis Bahan</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <SignOutButton />
        </div>
      </Card>

      {(user.role === "usaha" || user.role === "admin") && (
        <Card className="mt-6 p-6 sm:p-8 border border-black/[0.06] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">
                Kalkulator Mentah vs Olahan
              </h2>
              <p className="text-sm text-muted mt-1">
                Bandingkan untung jual mentah dan olah dulu.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            href="/dashboard/kalkulator"
            className="shrink-0"
          >
            Buka Kalkulator
          </Button>
        </Card>
      )}
    </div>
  );
}

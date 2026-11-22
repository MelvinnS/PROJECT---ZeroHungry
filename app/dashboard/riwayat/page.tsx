import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Riwayat Analisis | Dari Sisa Jadi Nilai",
  description: "Daftar riwayat penyelamatan pangan dapurmu.",
};

export default function RiwayatPlaceholderPage() {
  return (
    <div className="py-8 sm:py-12 max-w-xl mx-auto text-center">
      <Card className="p-8 sm:p-10 border border-black/[0.06] bg-white shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-[#E8F5EC] text-[#1B6B3A] mx-auto flex items-center justify-center mb-4">
          <Clock className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mb-2">
          Riwayat Analisis Lengkap
        </h1>
        <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed mb-6">
          Halaman riwayat lengkap dengan filter pencarian mendalam dan detail resep sedang disiapkan (Segera Hadir).
        </p>
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#1B6B3A] text-white hover:bg-[#0F4D2E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

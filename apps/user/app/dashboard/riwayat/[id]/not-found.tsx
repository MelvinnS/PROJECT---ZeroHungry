import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function RiwayatNotFound() {
  return (
    <div className="py-12 md:py-16 max-w-md mx-auto text-center px-4">
      <Card className="p-8 sm:p-10 border border-black/[0.06] bg-white shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-[#E8F5EC] text-[#1B6B3A] mx-auto flex items-center justify-center mb-4">
          <FileQuestion className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-2 tracking-tight">
          Riwayat tidak ditemukan
        </h1>
        <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
          Data analisis bahan yang kamu cari tidak tersedia atau mungkin sudah
          dihapus.
        </p>
        <Link
          href="/dashboard/riwayat"
          className="inline-flex items-center justify-center gap-2 bg-[#1B6B3A] hover:bg-[#0F4D2E] text-white font-bold px-6 py-3 rounded-full text-sm transition-all min-h-[44px] shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>
      </Card>
    </div>
  );
}

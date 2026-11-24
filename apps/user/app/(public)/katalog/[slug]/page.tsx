import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Utensils,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { OLAHAN, getOlahanBySlug } from "@/lib/katalog-data";
import { FoodImage } from "@/components/ui/FoodImage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return OLAHAN.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const olahan = getOlahanBySlug(slug);

  if (!olahan) {
    return {
      title: "Olahan Tidak Ditemukan | Dari Sisa Jadi Nilai",
      description: "Resep olahan yang dicari tidak ditemukan.",
    };
  }

  return {
    title: `${olahan.nama} | Dari Sisa Jadi Nilai`,
    description: olahan.deskripsi,
  };
}

export default async function OlahanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const olahan = getOlahanBySlug(slug);

  if (!olahan) {
    notFound();
  }

  const badgeVariant = olahan.kesulitan === "Sedang" ? "warning" : "success";

  return (
    <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Tombol Kembali ke Katalog */}
      <div className="mb-6">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      {/* Gambar Utama */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] w-full rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-8 bg-muted-bg">
        <FoodImage
          src={olahan.gambar}
          alt={olahan.nama}
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* Header Info */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary" className="text-xs uppercase tracking-wider">
            {olahan.kategori}
          </Badge>
          <Badge variant={badgeVariant} className="text-xs">
            {olahan.kesulitan}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight mb-3">
          {olahan.nama}
        </h1>

        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-3xl mb-6">
          {olahan.deskripsi}
        </p>

        {/* Highlight Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-black/[0.06] text-xs sm:text-sm font-medium text-ink shadow-xs">
            <Clock className="w-4 h-4 text-primary stroke-[2]" />
            <span>Waktu: {olahan.durasiLabel}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-black/[0.06] text-xs sm:text-sm font-medium text-ink shadow-xs">
            <Utensils className="w-4 h-4 text-primary stroke-[2]" />
            <span>Porsi: {olahan.porsi} Porsi</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-black/[0.06] text-xs sm:text-sm font-medium text-ink shadow-xs">
            <Sparkles className="w-4 h-4 text-primary stroke-[2]" />
            <span>Bahan Utama: {olahan.bahanSumber}</span>
          </div>
        </div>
      </header>

      {/* Konten 2 Kolom: Bahan & Langkah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Kolom Kiri: Daftar Bahan */}
        <section className="lg:col-span-5" aria-labelledby="heading-bahan">
          <Card className="h-full border border-black/[0.06] shadow-sm">
            <h2
              id="heading-bahan"
              className="text-lg sm:text-xl font-bold text-ink mb-5 flex items-center gap-2"
            >
              <span>Bahan yang Dibutuhkan</span>
            </h2>
            <ul className="space-y-3">
              {olahan.bahan.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-ink/90 leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Kolom Kanan: Langkah Pembuatan */}
        <section className="lg:col-span-7" aria-labelledby="heading-langkah">
          <Card className="h-full border border-black/[0.06] shadow-sm">
            <h2
              id="heading-langkah"
              className="text-lg sm:text-xl font-bold text-ink mb-5"
            >
              Langkah Pembuatan
            </h2>
            <ol className="space-y-5">
              {olahan.langkah.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base text-ink/90 leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-gradient-to-br from-[#1b6b3a] to-[#124525] text-white rounded-[32px] p-6 sm:p-8 md:p-10 shadow-lg text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Punya sisa {olahan.bahanSumber.toLowerCase()} di rumah?
          </h3>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Gunakan fitur Coba Cepat untuk menganalisis kondisi spesifik bahanmu
            dan dapatkan panduan keamanan serta rekomendasi olahan lengkap.
          </p>
        </div>
        <Button
          variant="white"
          size="lg"
          href={`/coba-cepat?bahan=${encodeURIComponent(olahan.kategori)}`}
          className="shrink-0 flex items-center gap-2 text-primary font-bold shadow-md hover:bg-white/95"
        >
          <span>Coba Analisis Bahan Ini</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </article>
  );
}

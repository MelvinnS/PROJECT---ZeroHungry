"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Olahan } from "@/lib/katalog-data";
import { Badge } from "@/components/ui/Badge";
import { FoodImage } from "@/components/ui/FoodImage";

interface OlahanCardProps {
  olahan: Olahan;
}

export const OlahanCard: React.FC<OlahanCardProps> = ({ olahan }) => {
  const badgeVariant = olahan.kesulitan === "Sedang" ? "warning" : "success";

  return (
    <Link
      href={`/katalog/${olahan.slug}`}
      className="group flex flex-col h-full bg-surface rounded-[24px] border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transform-none"
    >
      {/* Gambar olahan */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted-bg">
        <FoodImage
          src={olahan.gambar}
          alt={olahan.nama}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Konten kartu */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
          {olahan.kategori}
        </span>
        <h3 className="font-bold text-ink text-base md:text-lg line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {olahan.nama}
        </h3>
        <p className="text-xs text-muted mt-1.5 line-clamp-1">
          Bahan: {olahan.bahanSumber}
        </p>

        {/* Footer kartu: durasi & tingkat kesulitan */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/[0.04]">
          <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-muted stroke-[1.8]" />
            <span>{olahan.durasiLabel}</span>
          </div>
          <Badge variant={badgeVariant} className="text-[11px] py-0.5 px-2.5">
            {olahan.kesulitan}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

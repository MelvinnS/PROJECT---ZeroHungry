import React from "react";
import Image from "next/image";
import Link from "next/link";

interface OlahanItem {
  nama: string;
  durasi: string;
  gambar: string;
  alt: string;
}

const CONTOH_OLAHAN: OlahanItem[] = [
  {
    nama: "Keripik Kulit Pisang Krispi",
    durasi: "35 menit",
    gambar: "/images/olahan-keripik-kulit-pisang.jpg",
    alt: "Keripik renyah dari kulit pisang berbumbu gurih di atas mangkuk kayu",
  },
  {
    nama: "Tepung Singkong Serbaguna",
    durasi: "2 hari",
    gambar: "/images/olahan-tepung-singkong.jpg",
    alt: "Tepung singkong mocaf buatan sendiri dalam toples kaca kedap udara",
  },
  {
    nama: "Nugget Batang Bayam & Tempe",
    durasi: "40 menit",
    gambar: "/images/olahan-nugget-bayam-tempe.jpg",
    alt: "Nugget tempe dan batang bayam goreng keemasan dengan saus cocolan",
  },
];

export const ContohOlahan: React.FC = () => {
  return (
    <section className="py-12 md:py-20 border-b border-black/[0.06]">
      {/* Header Baris Judul & Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 md:mb-8 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Contoh Olahan
        </h2>
        <Link
          href="/katalog"
          className="inline-flex items-center text-sm sm:text-base font-semibold text-primary hover:text-[#15542d] transition-colors group min-h-[44px] py-1"
        >
          <span>Lihat semua olahan</span>
          <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Grid 3 Kartu Olahan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONTOH_OLAHAN.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col text-left focus:outline-none"
          >
            {/* Foto Rasio 3:2 dengan Rounded 24px */}
            <div className="relative w-full aspect-[3/2] rounded-[24px] overflow-hidden bg-surface shadow-xs border border-black/[0.04]">
              <Image
                src={item.gambar}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Nama & Durasi */}
            <h3 className="font-bold text-base sm:text-lg text-ink mt-3.5 mb-1 group-hover:text-primary transition-colors">
              {item.nama}
            </h3>
            <p className="text-muted text-sm font-medium">
              Durasi: {item.durasi}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

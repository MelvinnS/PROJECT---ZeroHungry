import React from "react";
import { ShoppingBasket, ShieldCheck, CookingPot } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StepItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    icon: ShoppingBasket,
    title: "1. Masukkan bahan",
    description: "Ketik nama sisa bahan yang ada di dapur.",
  },
  {
    icon: ShieldCheck,
    title: "2. Cek keamanan & ide olahan",
    description: "Ketahui kelayakan higienis dan resep praktisnya.",
  },
  {
    icon: CookingPot,
    title: "3. Mulai memasak",
    description: "Ikuti langkah mudah membuat makanan lezat bernilai.",
  },
];

export const CaraKerja: React.FC = () => {
  return (
    <section className="py-12 md:py-20 border-b border-black/[0.06]">
      {/* Judul Section */}
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mb-6 md:mb-8 text-left">
        Cara Kerja
      </h2>

      {/* Grid 3 Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={index}
              className="p-5 sm:p-6 flex flex-col items-start text-left bg-surface hover:border-black/[0.08] transition-all"
            >
              {/* Kotak Ikon Kecil Putih */}
              <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-black/[0.05] flex items-center justify-center text-primary mb-4">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Judul Bernomor */}
              <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
                {step.title}
              </h3>

              {/* Deskripsi */}
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

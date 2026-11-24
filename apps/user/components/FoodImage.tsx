"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChefHat } from "lucide-react";

interface FoodImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F5EC] to-[#D5EEDB] text-primary select-none ${className}`}
        aria-label={alt}
        role="img"
      >
        <div className="w-12 h-12 rounded-full bg-white/80 shadow-xs flex items-center justify-center mb-1">
          <ChefHat className="w-6 h-6 stroke-[1.8]" />
        </div>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-primary/80">
          Olahan Pangan
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
};

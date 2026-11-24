"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, X, SearchX } from "lucide-react";
import {
  OLAHAN,
  KATEGORI_FILTER,
  KategoriFilter,
  Olahan,
} from "@/lib/katalog-data";
import { OlahanCard } from "@/components/katalog/OlahanCard";
import { Button } from "@/components/ui/Button";

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_STEP = 4;

export const KatalogClient: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<KategoriFilter>("Semua");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle filter category change
  const handleCategoryChange = (cat: KategoriFilter) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    searchInputRef.current?.focus();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Filter olahan
  const filteredOlahan = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return OLAHAN.filter((item: Olahan) => {
      // Kategori filter
      if (
        selectedCategory !== "Semua" &&
        item.kategori.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Search query filter (nama, bahanSumber, deskripsi, atau bahan)
      if (q) {
        const matchNama = item.nama.toLowerCase().includes(q);
        const matchSumber = item.bahanSumber.toLowerCase().includes(q);
        const matchDeskripsi = item.deskripsi.toLowerCase().includes(q);
        const matchBahan = item.bahan.some((b) => b.toLowerCase().includes(q));
        return matchNama || matchSumber || matchDeskripsi || matchBahan;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const visibleOlahan = filteredOlahan.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOlahan.length;

  return (
    <div className="py-8 md:py-12">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
          Jelajahi Olahan
        </h1>
        <p className="text-muted text-base md:text-lg leading-relaxed">
          Temukan inspirasi resep kreatif untuk mengolah bahan pangan sisa
          menjadi hidangan lezat, hemat, dan ramah lingkungan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-6 relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-muted absolute left-4 pointer-events-none stroke-[2]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari nama olahan atau bahan pangan sisa..."
            className="w-full pl-12 pr-11 py-3.5 bg-surface text-ink placeholder:text-muted/70 text-sm md:text-base rounded-full border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            aria-label="Cari olahan makanan"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 p-1 rounded-full text-muted hover:text-ink hover:bg-black/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 mb-8">
        {KATEGORI_FILTER.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-ink/80 border border-black/[0.06] hover:bg-black/[0.02] hover:text-ink"
              }`}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Status info (jumlah olahan) */}
      <div className="mb-6 flex items-center justify-between text-xs md:text-sm text-muted">
        <span aria-live="polite">
          Menampilkan{" "}
          <strong className="text-ink font-semibold">
            {filteredOlahan.length}
          </strong>{" "}
          olahan
          {selectedCategory !== "Semua" && ` kategori ${selectedCategory}`}
          {searchQuery && ` untuk "${searchQuery}"`}
        </span>
      </div>

      {/* Grid or Empty State */}
      {filteredOlahan.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleOlahan.map((item) => (
              <OlahanCard key={item.slug} olahan={item} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setVisibleCount((prev) => prev + LOAD_MORE_STEP)
                }
              >
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center bg-surface rounded-[28px] border border-black/[0.05] max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-muted-bg flex items-center justify-center mx-auto mb-4 text-muted">
            <SearchX className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-1">
            Olahan tidak ditemukan
          </h3>
          <p className="text-sm text-muted mb-6">
            Tidak ada resep olahan yang cocok dengan pencarian atau filter yang
            dipilih. Coba gunakan kata kunci lain.
          </p>
          <Button variant="outline" size="md" onClick={handleResetFilters}>
            Hapus Pencarian & Filter
          </Button>
        </div>
      )}
    </div>
  );
};

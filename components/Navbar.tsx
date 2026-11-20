"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

interface NavItem {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
    isActive: (pathname: string) => pathname === "/",
  },
  {
    label: "Coba Cepat",
    href: "/coba-cepat",
    isActive: (pathname: string) => pathname.startsWith("/coba-cepat"),
  },
  {
    label: "Katalog Olahan",
    href: "/katalog",
    isActive: (pathname: string) => pathname.startsWith("/katalog"),
  },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Sesuaikan state jika rute berganti (pola resmi React untuk reset state saat route berubah)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Handle tombol Escape untuk menutup panel mobile & kunci scroll body saat terbuka
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Bar Navigasi Atas dengan Efek Blur Terisolasi */}
      <div className="w-full h-16 md:h-[68px] bg-white/90 backdrop-blur-md border-b border-black/[0.06] transition-all">
        <div className="max-w-6xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          {/* Kiri: Logo + Nama Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            onClick={() => setIsOpen(false)}
          >
            <Logo size={36} />
            <span className="font-bold text-ink text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">
              <span className="hidden min-[380px]:inline">Dari Sisa Jadi Nilai</span>
              <span className="inline min-[380px]:hidden">Sisa Jadi Nilai</span>
            </span>
          </Link>

          {/* Tengah (Desktop >= 768px): Wadah Pill Abu Muda Berisi Tepat 3 Item */}
          <nav
            className="hidden md:flex items-center bg-[#F0F3F0] p-1 rounded-full border border-black/[0.03]"
            aria-label="Navigasi Utama"
          >
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 select-none ${
                    active
                      ? "bg-primary text-white shadow-sm font-semibold"
                      : "text-ink hover:text-primary hover:bg-black/[0.03]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Kanan (Desktop >= 768px): Tombol Masuk & Daftar Gratis */}
          <div className="hidden md:flex items-center gap-2.5">
            <Button variant="outline" size="md" href="/masuk">
              Masuk
            </Button>
            <Button variant="primary" size="md" href="/daftar">
              Daftar Gratis
            </Button>
          </div>

          {/* Tombol Hamburger Mobile (< 768px) dengan area sentuh minimal 44x44px */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 rounded-full text-ink hover:text-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Panel Navigasi Mobile (< 768px) sebagai sibling bar atas, di luar lapisan backdrop-filter */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 md:hidden h-[calc(100dvh-4rem)] bg-white z-40 overflow-y-auto px-5 py-6 flex flex-col justify-between shadow-2xl border-b border-black/[0.06] animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
        >
          {/* 3 Menu sebagai baris besar */}
          <div className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-5 min-h-[48px] rounded-2xl text-base font-medium transition-all ${
                    active
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "text-ink bg-surface hover:bg-black/[0.04] active:bg-black/[0.06]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Tombol Masuk & Daftar Bertumpuk Vertikal Selebar Penuh dengan Padding Bawah Ekstra */}
          <div className="flex flex-col gap-3 pt-6 pb-10 border-t border-black/[0.06] mt-6">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              href="/masuk"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              href="/daftar"
              onClick={() => setIsOpen(false)}
            >
              Daftar Gratis
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Profil } from "@/lib/auth-client";

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

interface NavbarProps {
  user?: Profil | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Penanganan aman jika gagal
    }
    router.push("/");
    router.refresh();
  };

  const namaDepan = user?.nama?.trim().split(" ")[0] || "Pengguna";

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

          {/* Kanan (Desktop >= 768px): Autentikasi */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium text-ink/80 max-w-[130px] truncate" title={`Halo, ${user.nama}`}>
                  Halo, <strong className="font-semibold text-primary">{namaDepan}</strong>
                </span>
                <Button variant="outline" size="md" href="/dashboard">
                  Dashboard
                </Button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-rose-600 transition-colors px-2 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Keluar dari akun"
                  aria-label="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" size="md" href="/masuk">
                  Masuk
                </Button>
                <Button variant="primary" size="md" href="/daftar">
                  Daftar Gratis
                </Button>
              </>
            )}
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

          {/* Tombol Bagian Bawah Mobile Bertumpuk Vertikal */}
          <div className="flex flex-col gap-3 pt-6 pb-10 border-t border-black/[0.06] mt-6">
            {user ? (
              <>
                <div className="px-1 text-sm text-muted">
                  Masuk sebagai{" "}
                  <strong className="text-ink font-semibold">
                    Halo, {namaDepan}
                  </strong>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl text-base font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

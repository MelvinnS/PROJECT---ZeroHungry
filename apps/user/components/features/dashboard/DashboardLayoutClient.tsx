"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  BarChart2,
  History,
  Calculator,
  LogOut,
  Menu,
  X,
  Sprout,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { RolePengguna } from "@/lib/auth";

interface DashboardLayoutClientProps {
  role: RolePengguna;
  children: React.ReactNode;
}

export const DashboardLayoutClient: React.FC<DashboardLayoutClientProps> = ({
  role,
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Tutup drawer saat rute berubah (pola resmi React untuk menyelaraskan state saat prop/rute berubah)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  // Kunci scroll body saat drawer terbuka
  useEffect(() => {
    if (drawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [drawerOpen]);

  // Tutup drawer dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // safe fallback
    }
    router.push("/");
    router.refresh();
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Analisis Bahan",
      href: "/coba-cepat",
      icon: BarChart2,
      isActive: pathname === "/coba-cepat",
    },
    {
      label: "Riwayat",
      href: "/dashboard/riwayat",
      icon: History,
      isActive: pathname.startsWith("/dashboard/riwayat"),
    },
  ];

  if (role === "usaha" || role === "admin") {
    navItems.push({
      label: "Kalkulator",
      href: "/dashboard/kalkulator",
      icon: Calculator,
      isActive: pathname.startsWith("/dashboard/kalkulator"),
    });
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col lg:flex-row">
      {/* ─────────────────────────────────────────────────────────────
          1) MOBILE / TABLET TOP BAR (<1024px)
          Tinggi 64px, putih solid (bukan blur)
         ───────────────────────────────────────────────────────────── */}
      <header className="lg:hidden h-16 bg-white border-b border-black/[0.06] sticky top-0 z-40 px-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu navigasi"
            aria-expanded={drawerOpen}
            className="w-11 h-11 flex items-center justify-center text-[#111111] hover:bg-black/5 rounded-full transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F4D2E] text-white flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[#0F4D2E] text-sm tracking-tight">
              Dari Sisa Jadi Nilai
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Keluar dari akun"
          className="w-11 h-11 flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] hover:bg-black/5 rounded-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2) MOBILE DRAWER (<1024px)
          Overlay semi-transparan + drawer meluncur dari kiri (100dvh, rounded-r 32px)
         ───────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity lg:hidden no-print"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[80%] max-w-[320px] h-[100dvh] bg-[#0F4D2E] rounded-r-[32px] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out lg:hidden no-print ${
          drawerOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-label="Menu navigasi samping"
      >
        <div>
          {/* Header Drawer: Logo & Tombol Tutup */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white text-[#0F4D2E] flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Dari Sisa Jadi Nilai
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Mobile */}
          <nav className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`min-h-[48px] px-4 py-3 rounded-2xl flex items-center gap-3.5 text-sm font-semibold transition-all ${
                    item.isActive
                      ? "bg-white text-[#1B6B3A] shadow-xs"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tombol Keluar di Dasar Drawer */}
        <div className="pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full min-h-[48px] px-4 py-3 rounded-2xl flex items-center gap-3.5 text-sm font-semibold text-white/85 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          3) DESKTOP SIDEBAR MELAYANG (≥1024px)
          Lebar 240px, forest #0F4D2E, rounded 32px, sticky tinggi layar
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-[260px] shrink-0 p-4 sticky top-0 h-screen no-print">
        <aside className="w-[240px] h-full bg-[#0F4D2E] rounded-[32px] p-5 flex flex-col justify-between shadow-sm">
          <div>
            {/* Logo Brand */}
            <div className="flex items-center gap-3 px-1 pt-1 mb-8">
              <div className="w-9 h-9 rounded-full bg-white text-[#0F4D2E] flex items-center justify-center shrink-0 shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight leading-tight">
                Dari Sisa Jadi Nilai
              </span>
            </div>

            {/* Menu Navigasi Desktop */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`min-h-[44px] px-4 py-2.5 rounded-full flex items-center gap-3 text-sm font-semibold transition-all select-none ${
                      item.isActive
                        ? "bg-white text-[#1B6B3A] shadow-xs"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Tombol Keluar di Bawah */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-full flex items-center gap-3 text-sm font-semibold text-white/85 hover:text-white hover:bg-white/10 transition-colors select-none"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Keluar</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4) AREA KONTEN UTAMA (KANAN)
          Latar putih, max-w-5xl
         ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
};

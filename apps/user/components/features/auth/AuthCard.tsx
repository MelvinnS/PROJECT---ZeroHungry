"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout,
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Store,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { terjemahAuthError } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

interface AuthCardProps {
  tabAwal: "masuk" | "daftar";
  nextUrl: string;
  isConfigured: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  tabAwal,
  nextUrl,
  isConfigured,
}) => {
  const router = useRouter();
  const [tab, setTab] = useState<"masuk" | "daftar">(tabAwal);

  // Form Masuk State
  const [masukEmail, setMasukEmail] = useState("");
  const [masukPassword, setMasukPassword] = useState("");
  const [showMasukPassword, setShowMasukPassword] = useState(false);

  // Form Daftar State
  const [daftarNama, setDaftarNama] = useState("");
  const [daftarEmail, setDaftarEmail] = useState("");
  const [daftarPassword, setDaftarPassword] = useState("");
  const [showDaftarPassword, setShowDaftarPassword] = useState(false);
  const [role, setRole] = useState<"rumah_tangga" | "usaha">("rumah_tangga");
  const [tipeUsaha, setTipeUsaha] = useState<"UMKM" | "Petani">("UMKM");
  const [namaUsaha, setNamaUsaha] = useState("");

  // Feedback State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Input Refs untuk Auto-fokus
  const masukEmailRef = useRef<HTMLInputElement>(null);
  const masukPasswordRef = useRef<HTMLInputElement>(null);
  const daftarNamaRef = useRef<HTMLInputElement>(null);
  const daftarEmailRef = useRef<HTMLInputElement>(null);
  const daftarPasswordRef = useRef<HTMLInputElement>(null);
  const daftarNamaUsahaRef = useRef<HTMLInputElement>(null);

  // Switch Tab
  const handleSwitchTab = (newTab: "masuk" | "daftar") => {
    setTab(newTab);
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);
    router.replace(newTab === "masuk" ? "/masuk" : "/daftar");
  };

  // Validasi Email sederhana
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Submit Masuk
  const handleSubmitMasuk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;

    const newErrors: Record<string, string> = {};
    if (!masukEmail.trim()) {
      newErrors.masukEmail = "Email wajib diisi.";
    } else if (!isValidEmail(masukEmail)) {
      newErrors.masukEmail = "Format email tidak valid.";
    }

    if (!masukPassword) {
      newErrors.masukPassword = "Kata sandi wajib diisi.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.masukEmail) masukEmailRef.current?.focus();
      else if (newErrors.masukPassword) masukPasswordRef.current?.focus();
      return;
    }

    setErrors({});
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: masukEmail.trim(),
        password: masukPassword,
      });

      if (error) {
        setServerError(terjemahAuthError(error));
        setIsLoading(false);
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setServerError(terjemahAuthError(err));
      setIsLoading(false);
    }
  };

  // Submit Daftar
  const handleSubmitDaftar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;

    const newErrors: Record<string, string> = {};
    const trimmedNama = daftarNama.trim();
    if (!trimmedNama || trimmedNama.length < 2 || trimmedNama.length > 60) {
      newErrors.daftarNama = "Nama lengkap wajib diisi (2-60 karakter).";
    }

    if (!daftarEmail.trim()) {
      newErrors.daftarEmail = "Email wajib diisi.";
    } else if (!isValidEmail(daftarEmail)) {
      newErrors.daftarEmail = "Format email tidak valid.";
    }

    if (!daftarPassword || daftarPassword.length < 8) {
      newErrors.daftarPassword = "Kata sandi minimal 8 karakter.";
    }

    if (role === "usaha") {
      const trimmedNamaUsaha = namaUsaha.trim();
      if (
        !trimmedNamaUsaha ||
        trimmedNamaUsaha.length < 2 ||
        trimmedNamaUsaha.length > 80
      ) {
        newErrors.daftarNamaUsaha = "Nama usaha wajib diisi (2-80 karakter).";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.daftarNama) daftarNamaRef.current?.focus();
      else if (newErrors.daftarEmail) daftarEmailRef.current?.focus();
      else if (newErrors.daftarPassword) daftarPasswordRef.current?.focus();
      else if (newErrors.daftarNamaUsaha) daftarNamaUsahaRef.current?.focus();
      return;
    }

    setErrors({});
    setServerError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: daftarEmail.trim(),
        password: daftarPassword,
        options: {
          data: {
            nama: trimmedNama,
            role: role === "usaha" ? "usaha" : "rumah_tangga",
            tipe_usaha: role === "usaha" ? tipeUsaha : null,
            nama_usaha: role === "usaha" ? namaUsaha.trim() : null,
          },
        },
      });

      if (error) {
        setServerError(terjemahAuthError(error));
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextUrl);
        router.refresh();
      } else if (data.user) {
        setSuccessMessage(
          "Pendaftaran berhasil. Cek email kamu untuk konfirmasi, lalu masuk."
        );
        setIsLoading(false);
      } else {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err) {
      setServerError(terjemahAuthError(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        {/* Logo Bulat & Identitas Aplikasi */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-2.5 shadow-xs">
            <Sprout className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Dari Sisa Jadi Nilai
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1.5">
            Selamat Datang
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Kelola bahan sisa dan pantau nilai dapurmu.
          </p>
        </div>

        {/* Notifikasi Belum Dikonfigurasi */}
        {!isConfigured && (
          <div
            className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5"
            role="status"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Perhatian:</strong> Fitur masuk belum dikonfigurasi. Hubungi
              tim pengembang.
            </p>
          </div>
        )}

        {/* Switch Tab Pill */}
        <div
          role="tablist"
          aria-label="Pilihan Masuk atau Daftar"
          className="bg-black/[0.04] p-1.5 rounded-full flex gap-1 mb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "masuk"}
            onClick={() => handleSwitchTab("masuk")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 text-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              tab === "masuk"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "daftar"}
            onClick={() => handleSwitchTab("daftar")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 text-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              tab === "daftar"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Notifikasi Server Error */}
        {serverError && (
          <div
            aria-live="polite"
            className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{serverError}</p>
          </div>
        )}

        {/* Notifikasi Sukses Pendaftaran */}
        {successMessage && (
          <div
            aria-live="polite"
            className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {/* FORM MASUK */}
        {tab === "masuk" ? (
          <form onSubmit={handleSubmitMasuk} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="masuk-email"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Email
              </label>
              <input
                id="masuk-email"
                ref={masukEmailRef}
                type="email"
                autoComplete="email"
                placeholder="contoh: nama@email.com"
                value={masukEmail}
                onChange={(e) => setMasukEmail(e.target.value)}
                className={`w-full rounded-2xl bg-surface px-4 py-3.5 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.masukEmail ? "border-danger focus:ring-danger/20" : ""
                }`}
              />
              {errors.masukEmail && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.masukEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="masuk-password"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="masuk-password"
                  ref={masukPasswordRef}
                  type={showMasukPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  value={masukPassword}
                  onChange={(e) => setMasukPassword(e.target.value)}
                  className={`w-full rounded-2xl bg-surface px-4 py-3.5 pr-12 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.masukPassword
                      ? "border-danger focus:ring-danger/20"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowMasukPassword(!showMasukPassword)}
                  aria-label={
                    showMasukPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-ink transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {showMasukPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.masukPassword && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.masukPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isConfigured || isLoading}
                className="flex items-center justify-center gap-2 font-bold shadow-md"
              >
                <span>{isLoading ? "Memproses…" : "Masuk"}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        ) : (
          /* FORM DAFTAR */
          <form onSubmit={handleSubmitDaftar} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="daftar-nama"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Nama Lengkap
              </label>
              <input
                id="daftar-nama"
                ref={daftarNamaRef}
                type="text"
                autoComplete="name"
                placeholder="Nama lengkap kamu"
                value={daftarNama}
                onChange={(e) => setDaftarNama(e.target.value)}
                className={`w-full rounded-2xl bg-surface px-4 py-3.5 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.daftarNama ? "border-danger focus:ring-danger/20" : ""
                }`}
              />
              {errors.daftarNama && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.daftarNama}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="daftar-email"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Email
              </label>
              <input
                id="daftar-email"
                ref={daftarEmailRef}
                type="email"
                autoComplete="email"
                placeholder="contoh: nama@email.com"
                value={daftarEmail}
                onChange={(e) => setDaftarEmail(e.target.value)}
                className={`w-full rounded-2xl bg-surface px-4 py-3.5 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.daftarEmail ? "border-danger focus:ring-danger/20" : ""
                }`}
              />
              {errors.daftarEmail && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.daftarEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="daftar-password"
                className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
              >
                Kata Sandi (minimal 8 karakter)
              </label>
              <div className="relative">
                <input
                  id="daftar-password"
                  ref={daftarPasswordRef}
                  type={showDaftarPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={daftarPassword}
                  onChange={(e) => setDaftarPassword(e.target.value)}
                  className={`w-full rounded-2xl bg-surface px-4 py-3.5 pr-12 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.daftarPassword
                      ? "border-danger focus:ring-danger/20"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowDaftarPassword(!showDaftarPassword)}
                  aria-label={
                    showDaftarPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-ink transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {showDaftarPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.daftarPassword && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.daftarPassword}
                </p>
              )}
            </div>

            {/* Pilihan Peran Akun */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-ink mb-2">
                Pilih Peran Akun
              </label>
              <div
                role="radiogroup"
                aria-label="Pilih Peran Akun"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {/* Opsi 1: Rumah Tangga */}
                <div
                  role="radio"
                  aria-checked={role === "rumah_tangga"}
                  tabIndex={0}
                  onClick={() => setRole("rumah_tangga")}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setRole("rumah_tangga");
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    role === "rumah_tangga"
                      ? "border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary/30"
                      : "border-black/[0.08] bg-surface hover:bg-black/[0.02]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      role === "rumah_tangga"
                        ? "bg-primary text-white"
                        : "bg-black/[0.05] text-muted"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-ink">
                      Rumah Tangga
                    </h4>
                    <p className="text-[11px] text-muted mt-0.5">
                      Untuk dapur sendiri
                    </p>
                  </div>
                </div>

                {/* Opsi 2: Pelaku Usaha */}
                <div
                  role="radio"
                  aria-checked={role === "usaha"}
                  tabIndex={0}
                  onClick={() => setRole("usaha")}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setRole("usaha");
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    role === "usaha"
                      ? "border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary/30"
                      : "border-black/[0.08] bg-surface hover:bg-black/[0.02]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      role === "usaha"
                        ? "bg-primary text-white"
                        : "bg-black/[0.05] text-muted"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-ink">
                      Pelaku Usaha
                    </h4>
                    <p className="text-[11px] text-muted mt-0.5">
                      UMKM atau Petani
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Tambahan Jika Pelaku Usaha */}
            {role === "usaha" && (
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3.5 animate-fadeIn">
                <div>
                  <label
                    htmlFor="tipe-usaha"
                    className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
                  >
                    Tipe Usaha
                  </label>
                  <select
                    id="tipe-usaha"
                    value={tipeUsaha}
                    onChange={(e) =>
                      setTipeUsaha(e.target.value as "UMKM" | "Petani")
                    }
                    className="w-full rounded-2xl bg-surface px-4 py-3 text-sm sm:text-base text-ink border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="UMKM">UMKM Kuliner / Olahan</option>
                    <option value="Petani">Petani / Produsen Bahan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="nama-usaha"
                    className="block text-xs sm:text-sm font-semibold text-ink mb-1.5"
                  >
                    Nama Usaha
                  </label>
                  <input
                    id="nama-usaha"
                    ref={daftarNamaUsahaRef}
                    type="text"
                    placeholder="Contoh: Warung Berkah / Kebun Mandiri"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    className={`w-full rounded-2xl bg-surface px-4 py-3 text-sm sm:text-base text-ink placeholder:text-muted/60 transition-all border border-black/[0.08] focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.daftarNamaUsaha
                        ? "border-danger focus:ring-danger/20"
                        : ""
                    }`}
                  />
                  {errors.daftarNamaUsaha && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                      {errors.daftarNamaUsaha}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isConfigured || isLoading}
                className="flex items-center justify-center gap-2 font-bold shadow-md"
              >
                <span>{isLoading ? "Memproses…" : "Daftar"}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

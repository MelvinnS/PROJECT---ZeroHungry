"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { ChefHat, X, Send, WifiOff, ChevronDown } from "lucide-react";
import type { KonteksChef, PesanRiwayat } from "@/lib/prompts-chef";

// Tipe untuk daftar resep yang bisa dipilih
export interface ResepPilihan {
  nama: string;
  bahan_tambahan: Array<{ nama: string; jumlah: string }>;
  langkah: string[];
}

export interface ChefChatProps {
  /**
   * Konteks bahan (tanpa resep; resep dipilih dari daftarResep).
   */
  konteks: Omit<KonteksChef, "resep">;
  /**
   * Daftar resep yang bisa dipilih pengguna. Boleh kosong.
   */
  daftarResep?: ResepPilihan[];
  /**
   * Mode dashboard: hanya warna putih/hijau/hitam.
   */
  mono?: boolean;
}

interface PesanChat {
  id: string;
  role: "user" | "chef" | "offline";
  teks: string;
}

const PESAN_PEMBUKA =
  "Halo! Ada bahan yang kurang atau langkah yang membingungkan? Tanya saja.";

const CHIP_SARAN = [
  "Bahan ada yang nggak punya, gantinya apa?",
  "Jelaskan langkahnya lebih sederhana",
  "Bisa dimasak tanpa oven?",
  "Cara menyimpan hasilnya?",
];

const BATAS_PESAN_SESI = 15;

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export const ChefChat: React.FC<ChefChatProps> = ({
  konteks,
  daftarResep = [],
  mono = false,
}) => {
  const [panelTerbuka, setPanelTerbuka] = useState(false);
  const [pesanList, setPesanList] = useState<PesanChat[]>([
    { id: "pembuka", role: "chef", teks: PESAN_PEMBUKA },
  ]);
  const [inputTeks, setInputTeks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resepTerpilih, setResepTerpilih] = useState<string>("umum");
  const [sudahAdaPesanPertama, setSudahAdaPesanPertama] = useState(false);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const areaLogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonId = useId();
  const panelId = useId();

  // Hitung berapa pesan pengguna yang sudah dikirim
  const jumlahPesanUser = pesanList.filter((p) => p.role === "user").length;
  const batasTercapai = jumlahPesanUser >= BATAS_PESAN_SESI;

  // Scroll otomatis ke bawah saat ada pesan baru
  useEffect(() => {
    if (areaLogRef.current) {
      areaLogRef.current.scrollTop = areaLogRef.current.scrollHeight;
    }
  }, [pesanList, isLoading]);

  // Kunci scroll body di mobile saat panel terbuka
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (panelTerbuka && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelTerbuka]);

  // Tangkap Escape untuk menutup panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelTerbuka) {
        setPanelTerbuka(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelTerbuka]);

  // Fokus ke input saat panel terbuka
  useEffect(() => {
    if (panelTerbuka) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      toggleBtnRef.current?.focus();
    }
  }, [panelTerbuka]);

  const handleTogglePanel = () => {
    setPanelTerbuka((prev) => !prev);
  };

  const handleTutupPanel = () => {
    setPanelTerbuka(false);
    toggleBtnRef.current?.focus();
  };

  const kirimPesan = useCallback(
    async (teksInput: string) => {
      const teks = teksInput.trim();
      if (!teks || isLoading || batasTercapai) return;

      const pesanUser: PesanChat = {
        id: generateId(),
        role: "user",
        teks,
      };

      setSudahAdaPesanPertama(true);
      setPesanList((prev) => [...prev, pesanUser]);
      setInputTeks("");
      setIsLoading(true);

      // Susun riwayat untuk dikirim (maks 6 pesan terakhir, hanya user & chef sah)
      const riwayatSah: PesanRiwayat[] = pesanList
        .filter((p) => p.role === "user" || p.role === "chef")
        .slice(-6)
        .map((p) => ({ role: p.role as "user" | "chef", teks: p.teks }));

      // Tambahkan pesan user saat ini ke riwayat
      riwayatSah.push({ role: "user", teks });

      // Susun konteks dengan resep terpilih
      const resepDipilih =
        resepTerpilih !== "umum"
          ? daftarResep.find((r) => r.nama === resepTerpilih)
          : undefined;

      const konteksKirim: KonteksChef = {
        ...konteks,
        resep: resepDipilih,
      };

      // Panggil API dengan timeout 65 detik
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort("TIMEOUT"), 65000);

      try {
        const res = await fetch("/api/chef", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pesan: teks,
            riwayat: riwayatSah.slice(0, -1), // riwayat sebelum pesan saat ini
            konteks: konteksKirim,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const json = await res.json().catch(() => null);

        if (res.status === 429) {
          const errMsg =
            json?.error ||
            "Terlalu banyak pertanyaan. Coba lagi beberapa menit lagi.";
          setPesanList((prev) => [
            ...prev,
            { id: generateId(), role: "offline", teks: errMsg },
          ]);
        } else if (!res.ok || !json) {
          setPesanList((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "offline",
              teks: "Chef sedang offline. Coba lagi nanti.",
            },
          ]);
        } else if (json.offline) {
          setPesanList((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "offline",
              teks:
                json.jawaban || "Chef sedang offline. Coba lagi nanti.",
            },
          ]);
        } else {
          setPesanList((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "chef",
              teks: json.jawaban || "Chef sedang sibuk. Coba tanya lagi.",
            },
          ]);
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        const errMsg =
          err instanceof Error && err.name === "AbortError"
            ? "Waktu habis. Chef sedang sibuk, coba tanya lagi."
            : "Chef sedang offline. Coba lagi nanti.";
        setPesanList((prev) => [
          ...prev,
          { id: generateId(), role: "offline", teks: errMsg },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, batasTercapai, pesanList, konteks, daftarResep, resepTerpilih]
  );

  const handleKirimForm = (e: React.FormEvent) => {
    e.preventDefault();
    kirimPesan(inputTeks);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      kirimPesan(inputTeks);
    }
  };

  // Gaya berdasarkan prop mono
  const warnaPrimary = mono ? "#1B6B3A" : "#1B6B3A";
  const warnaPanel = mono ? "bg-white border border-black/[0.08]" : "bg-white border border-black/[0.06]";

  return (
    <>
      {/* ── Tombol Trigger Fixed ──────────────────────────────────────── */}
      <button
        ref={toggleBtnRef}
        id={buttonId}
        type="button"
        onClick={handleTogglePanel}
        aria-expanded={panelTerbuka}
        aria-controls={panelId}
        aria-label="Tanya Chef Sisa"
        style={{ backgroundColor: warnaPrimary }}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 px-4 py-3 rounded-full text-white text-sm font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all min-h-[48px] min-w-[48px]"
      >
        <ChefHat className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Tanya Chef</span>
      </button>

      {/* ── Overlay untuk Mobile ─────────────────────────────────────── */}
      {panelTerbuka && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={handleTutupPanel}
        />
      )}

      {/* ── Panel Utama ───────────────────────────────────────────────── */}
      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chef Sisa - Tanya tentang resep"
        className={`fixed z-50 flex flex-col transition-all duration-300 ${
          panelTerbuka
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 h-[85dvh] rounded-t-[32px]
          /* Desktop: kartu kanan bawah */
          md:bottom-24 md:right-5 md:left-auto md:w-[380px] md:h-auto md:max-h-[70dvh] md:rounded-[28px]
          ${warnaPanel} shadow-2xl`}
      >
        {/* Header Panel */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] shrink-0"
          style={{ borderRadius: "inherit inherit 0 0" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: warnaPrimary }}
            >
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#111111] leading-tight">
                Chef Sisa
              </p>
              <p className="text-[11px] text-[#6B6B6B] leading-tight">
                Pendamping masak bahan sisa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTutupPanel}
            aria-label="Tutup panel Chef Sisa"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#6B6B6B] hover:bg-[#F3F7F4] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Select Resep (hanya jika ada daftarResep) */}
        {daftarResep.length > 0 && (
          <div className="px-4 pt-3 pb-2 shrink-0 border-b border-black/[0.04]">
            <div className="relative">
              <label
                htmlFor="chef-resep-select"
                className="block text-[11px] font-semibold text-[#6B6B6B] mb-1 uppercase tracking-wider"
              >
                Membahas resep:
              </label>
              <div className="relative">
                <select
                  id="chef-resep-select"
                  value={resepTerpilih}
                  onChange={(e) => setResepTerpilih(e.target.value)}
                  className="w-full appearance-none bg-[#F3F7F4] border border-black/[0.08] rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/30 cursor-pointer"
                >
                  <option value="umum">Umum (tidak spesifik resep)</option>
                  {daftarResep.map((r) => (
                    <option key={r.nama} value={r.nama}>
                      {r.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6B6B] pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Area Log Percakapan */}
        <div
          ref={areaLogRef}
          role="log"
          aria-live="polite"
          aria-label="Percakapan dengan Chef Sisa"
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0"
        >
          {pesanList.map((pesan) => {
            const isUser = pesan.role === "user";
            const isOffline = pesan.role === "offline";

            return (
              <div
                key={pesan.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
              >
                {/* Avatar Chef */}
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isOffline ? "#F3F7F4" : warnaPrimary,
                    }}
                  >
                    {isOffline ? (
                      <WifiOff className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    ) : (
                      <ChefHat className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#1B6B3A] text-white rounded-tr-sm"
                      : isOffline
                      ? "bg-[#F3F7F4] text-[#6B6B6B] rounded-tl-sm italic"
                      : "bg-[#F3F7F4] text-[#111111] rounded-tl-sm"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {pesan.teks}
                </div>
              </div>
            );
          })}

          {/* Indikator mengetik */}
          {isLoading && (
            <div className="flex justify-start gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: warnaPrimary }}
              >
                <ChefHat className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-[#F3F7F4] rounded-2xl rounded-tl-sm px-4 py-3 flex flex-col gap-1.5">
                <div
                  className="flex gap-1 items-center motion-safe:animate-pulse"
                  aria-hidden="true"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1B6B3A]/40 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#1B6B3A]/40 inline-block [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#1B6B3A]/40 inline-block [animation-delay:0.3s]" />
                </div>
                <p className="text-[11px] text-[#6B6B6B] font-medium">
                  Chef sedang menyiapkan jawaban…
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chip Saran (hilang setelah pesan pertama) */}
        {!sudahAdaPesanPertama && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {CHIP_SARAN.map((saran) => (
              <button
                key={saran}
                type="button"
                onClick={() => kirimPesan(saran)}
                disabled={isLoading}
                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-[#E8F5EC] text-[#1B6B3A] border border-[#1B6B3A]/20 hover:bg-[#d4edda] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {saran}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2 shrink-0 border-t border-black/[0.06]">
          {batasTercapai ? (
            <p className="text-xs text-[#6B6B6B] text-center py-2 font-medium">
              Batas pertanyaan sesi ini tercapai. Muat ulang halaman untuk memulai lagi.
            </p>
          ) : (
            <form
              onSubmit={handleKirimForm}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={inputTeks}
                onChange={(e) => setInputTeks(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pertanyaan memasak…"
                maxLength={500}
                rows={1}
                disabled={isLoading}
                aria-label="Pesan untuk Chef Sisa"
                className="flex-1 resize-none rounded-2xl bg-[#F3F7F4] border border-black/[0.08] px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/30 disabled:opacity-50 leading-relaxed max-h-[120px]"
                style={{ fontSize: "16px", overflowY: "auto" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
              <button
                type="submit"
                aria-label="Kirim pesan ke Chef Sisa"
                disabled={!inputTeks.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                style={{ backgroundColor: warnaPrimary }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Padding bawah halaman di mobile agar konten tidak tertutup tombol */}
      <div className="h-20 md:h-0" aria-hidden="true" />
    </>
  );
};

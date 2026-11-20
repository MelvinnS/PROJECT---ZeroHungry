import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUserProfile } from "@/lib/auth";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dari Sisa Jadi Nilai",
  description:
    "Ubah bahan pangan sisa dapur menjadi makanan bernilai, aman, dan mudah. Kurangi food loss bersama teknologi pangan lokal.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserProfile();

  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-ink font-sans selection:bg-primary-soft selection:text-primary">
        <Navbar user={user} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

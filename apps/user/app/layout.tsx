import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  PublicNavbarWrapper,
  PublicFooterWrapper,
  PublicMainWrapper,
} from "@/components/layout/PublicLayoutWrapper";
import { getCurrentUserProfile } from "@/server/services/auth";

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
        <PublicNavbarWrapper>
          <Navbar user={user} />
        </PublicNavbarWrapper>
        <PublicMainWrapper>{children}</PublicMainWrapper>
        <PublicFooterWrapper>
          <Footer />
        </PublicFooterWrapper>
      </body>
    </html>
  );
}

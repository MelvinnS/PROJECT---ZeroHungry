import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile, sanitizeNext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard } from "@/components/features/auth/AuthCard";

export const metadata: Metadata = {
  title: "Daftar | Dari Sisa Jadi Nilai",
  description: "Daftar akun gratis di Dari Sisa Jadi Nilai untuk rumah tangga dan pelaku usaha pangan lokal.",
};

interface PageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function DaftarPage({ searchParams }: PageProps) {
  const user = await getCurrentUserProfile();
  if (user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const nextUrl = sanitizeNext(resolvedSearchParams?.next);
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-10 px-4 sm:px-6">
      <AuthCard
        tabAwal="daftar"
        nextUrl={nextUrl}
        isConfigured={isConfigured}
      />
    </div>
  );
}

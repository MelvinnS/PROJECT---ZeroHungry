import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile, sanitizeNext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Masuk | Dari Sisa Jadi Nilai",
  description: "Masuk ke akun Dari Sisa Jadi Nilai untuk mengelola olahan pangan dan nilai dapurmu.",
};

interface PageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function MasukPage({ searchParams }: PageProps) {
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
        tabAwal="masuk"
        nextUrl={nextUrl}
        isConfigured={isConfigured}
      />
    </div>
  );
}

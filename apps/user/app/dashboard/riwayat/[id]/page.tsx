import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { getRiwayatById } from "@/lib/riwayat";
import { DetailRiwayatClient } from "@/components/dashboard/DetailRiwayatClient";

export const metadata: Metadata = {
  title: "Detail Riwayat | Dari Sisa Jadi Nilai",
  description: "Rincian hasil analisis kelayakan bahan dan ide olahan pangan sisa dapur.",
};

interface DetailRiwayatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailRiwayatPage({
  params,
}: DetailRiwayatPageProps) {
  const { id } = await params;

  const user = await getCurrentUserProfile();
  if (!user) {
    redirect(`/masuk?next=/dashboard/riwayat/${id}`);
  }

  const riwayat = await getRiwayatById(id);
  if (!riwayat) {
    notFound();
  }

  return <DetailRiwayatClient riwayat={riwayat} />;
}

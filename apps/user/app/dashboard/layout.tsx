import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/services/auth";
import { DashboardLayoutClient } from "@/components/features/dashboard/DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Dashboard | Dari Sisa Jadi Nilai",
  description: "Dashboard pemantauan penyelamatan pangan dan dampak dapurmu.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk?next=/dashboard");
  }

  return (
    <DashboardLayoutClient role={user.role}>
      {children}
    </DashboardLayoutClient>
  );
}

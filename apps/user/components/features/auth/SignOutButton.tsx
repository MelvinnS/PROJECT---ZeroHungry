"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className = "" }) => {
  const router = useRouter();

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

  return (
    <Button
      variant="outline"
      size="md"
      onClick={handleSignOut}
      className={`inline-flex items-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span>Keluar</span>
    </Button>
  );
};

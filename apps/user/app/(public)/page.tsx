import React from "react";
import { Hero } from "@/components/features/landing/Hero";
import { CaraKerja } from "@/components/features/landing/CaraKerja";
import { ContohOlahan } from "@/components/features/landing/ContohOlahan";
import { CtaBand } from "@/components/features/landing/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CaraKerja />
      <ContohOlahan />
      <CtaBand />
    </>
  );
}

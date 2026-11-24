import React from "react";
import { Hero } from "@/components/landing/Hero";
import { CaraKerja } from "@/components/landing/CaraKerja";
import { ContohOlahan } from "@/components/landing/ContohOlahan";
import { CtaBand } from "@/components/landing/CtaBand";

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

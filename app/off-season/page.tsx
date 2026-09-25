"use client";

import dynamic from "next/dynamic";

const TreguaGame = dynamic(
  () => import("@/components/off-season/TreguaGame"),
  {
    ssr: false,
  }
);

export default function OffSeasonPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <TreguaGame />
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

const GODOT_URL = "https://mamima9.github.io/FANTAMICCIO/";

export default function OffSeasonPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://mamima9.github.io") return;
      if (event.data?.type === "fantamiccio-godot-ready") setLoaded(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#17110b] text-[#f4d98a]">
          <div className="text-center px-6">
            <div className="text-2xl font-black tracking-wide">FANTAMICCIO</div>
            <div className="mt-2 text-sm opacity-80">Caricamento Off Season…</div>
          </div>
        </div>
      )}

      <iframe
        title="FantaMiccio Off Season"
        src={GODOT_URL}
        className="block w-full h-full border-0"
        allow="fullscreen; autoplay; gamepad"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </main>
  );
}

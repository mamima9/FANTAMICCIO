"use client";

import Link from "next/link";

export default function MiccioCanterinoPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#5C3A21] via-[#7A4A25] to-[#D4AF37] text-white py-12 md:py-16">

        <div className="max-w-7xl mx-auto px-5 md:px-6">

          <Link
            href="/classifiche"
            className="inline-block mb-6 text-amber-200 font-bold hover:text-white transition"
          >
            ← Classifiche
          </Link>

          <p className="text-amber-200 font-bold uppercase tracking-widest text-sm">
            FantaMiccio
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-2">
            🎤 MiccioCanterino
          </h1>

          <p className="text-base md:text-xl text-amber-100 mt-3">
            Classifica della gara di canto.
          </p>

        </div>

      </section>


      {/* CONTENUTO PROVVISORIO */}

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-10">

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">

          <div className="text-6xl mb-6">
            🎤
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#5C3A21]">
            Classifica MiccioCanterino
          </h2>

          <p className="text-gray-500 mt-3">
            La classifica sarà disponibile prossimamente.
          </p>

        </div>

      </section>

    </main>
  );
}
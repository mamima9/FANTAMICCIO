"use client";

import Link from "next/link";

const classifiche = [
  {
    titolo: "Generale",
    emoji: "🏆",
    descrizione: "La classifica generale di tutti i contradaioli.",
    href: "/dashboard/classifiche/generale",
  },
  {
    titolo: "MiccioCanterino",
    emoji: "🎤",
    descrizione: "La classifica della gara di canto.",
    href: "/dashboard/classifiche/micciocanterino",
  },
  {
    titolo: "Calcio",
    emoji: "⚽",
    descrizione: "La classifica della gara di calcio.",
    href: "/dashboard/classifiche/calcio",
  },
  {
    titolo: "Popolarità",
    emoji: "⭐",
    descrizione: "Le contrade con più iscritti.",
    href: "/dashboard/classifiche/popolarita",
  },
  {
    titolo: "8 Contrade",
    emoji: "🏰",
    descrizione: "La classifica complessiva delle otto contrade.",
    href: "/dashboard/classifiche/8-contrade",
  },
  {
    titolo: "Singola Contrada",
    emoji: "🚩",
    descrizione: "La classifica interna di ogni contrada.",
    href: "/dashboard/classifiche/contrada",
  },
];

export default function ClassifichePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#5C3A21] via-[#7A4A25] to-[#D4AF37] text-white py-12 md:py-16">

        <div className="max-w-7xl mx-auto px-5 md:px-6">

          <p className="text-amber-200 font-bold uppercase tracking-widest text-sm">
            FantaMiccio
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-2">
            Classifiche
          </h1>

          <p className="text-base md:text-xl text-amber-100 mt-3 max-w-2xl">
            Tutte le classifiche del FantaMiccio.
          </p>

        </div>

      </section>

      {/* CARD */}

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {classifiche.map((classifica) => (

            <Link
              key={classifica.href}
              href={classifica.href}
              className="group"
            >

              <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 h-full border border-gray-100 hover:border-[#D4AF37] hover:shadow-xl hover:-translate-y-1 transition-all">

                <div className="text-4xl md:text-5xl mb-5">
                  {classifica.emoji}
                </div>

                <h2 className="text-xl md:text-2xl font-black text-[#5C3A21]">
                  {classifica.titolo}
                </h2>

                <p className="text-gray-600 mt-2 leading-relaxed text-sm md:text-base">
                  {classifica.descrizione}
                </p>

                <div className="mt-6 font-bold text-[#5C3A21] group-hover:text-[#D4AF37] transition">
                  Vedi classifica →
                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
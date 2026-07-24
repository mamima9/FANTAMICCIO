import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const competizioni = [
  { nome: "Corsa del Miccio", slug: "corsa", emoji: "🐴" },
  { nome: "Coppa del Presidente", slug: "coppa-presidente", emoji: "👑" },
  { nome: "Calcio", slug: "calcio", emoji: "⚽" },
  { nome: "Tema", slug: "tema", emoji: "🎭" },
  { nome: "Trofeo Meccheri", slug: "meccheri", emoji: "🥁" },
  { nome: "Miccio Canterino", slug: "miccio-canterino", emoji: "🎤" },
  { nome: "Staffetta", slug: "staffetta", emoji: "🏃" },
  { nome: "Bandiera", slug: "bandiera", emoji: "🚩" },
  { nome: "Alabarda", slug: "alabarda", emoji: "⚔️" },
  { nome: "Corteo Storico", slug: "corteo-storico", emoji: "👗" },
  { nome: "Miss Palio", slug: "miss-palio", emoji: "💃" },
];

export default function AlbiDoroPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F9F5EF] py-14">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <h1 className="text-5xl md:text-6xl font-extrabold text-[#5C3A21]">
              📜 Albi d'Oro
            </h1>

            <div className="w-40 h-1.5 bg-[#D4AF37] rounded-full mx-auto mt-5"></div>

            <p className="mt-6 text-lg text-[#7A5230] max-w-3xl mx-auto">
              Consulta tutti gli Albi d'Oro ufficiali del Palio dei Micci e
              delle competizioni che hanno fatto la storia di Querceta.
            </p>

          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {competizioni.map((gara) => (

              <Link
                key={gara.slug}
                href={`/albi-doro/${gara.slug}`}
                className="group rounded-3xl border-2 border-[#D4AF37] bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#B8860B]"
              >

                <div className="flex justify-center">

                  <div className="w-20 h-20 rounded-full bg-[#FFF6DA] border-2 border-[#D4AF37] flex items-center justify-center text-5xl group-hover:scale-110 transition">
                    {gara.emoji}
                  </div>

                </div>

                <h2 className="mt-6 text-center text-2xl font-bold text-[#5C3A21]">
                  {gara.nome}
                </h2>

                <div className="w-16 h-1 bg-[#D4AF37] rounded-full mx-auto my-4"></div>

                <p className="text-center text-[#7A5230]">
                  Consulta l'Albo d'Oro ufficiale
                </p>

                <div className="mt-8 text-center font-bold text-[#B8860B] group-hover:text-[#8B6508] transition">
                  Visualizza →
                </div>

              </Link>

            ))}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
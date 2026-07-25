import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Link from "next/link";
import Image from "next/image";

import { contrade } from "@/data/contrade";
import { introduzioneContrade } from "@/data/introduzioneContrade";

export default function ContradePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">
        {/* Hero */}

        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6">
            {introduzioneContrade.titolo}
          </h1>

          <div className="w-32 h-1 bg-amber-500 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-8 max-w-5xl mx-auto">
            {introduzioneContrade.descrizione}
          </p>
        </section>

        {/* Elenco Contrade */}

        <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contrade.map((contrada) => (
            <Link
              key={contrada.id}
              href={`/contrade/${contrada.id}`}
              className="group overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Stemma */}

              <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-8 flex justify-center items-center">
                <Image
                  src={contrada.stemma}
                  alt={contrada.nome}
                  width={150}
                  height={150}
                  className="object-contain h-36 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Contenuto */}

              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-amber-900 mb-5">
                  {contrada.nome}
                </h2>

                <div className="flex justify-center gap-3 mb-6">
                  <span
                    className="w-7 h-7 rounded-full border-2 border-gray-300"
                    style={{
                      backgroundColor: contrada.colori.primario,
                    }}
                  />

                  <span
                    className="w-7 h-7 rounded-full border-2 border-gray-300"
                    style={{
                      backgroundColor: contrada.colori.secondario,
                    }}
                  />

                  {contrada.colori.terziario && (
                    <span
                      className="w-7 h-7 rounded-full border-2 border-gray-300"
                      style={{
                        backgroundColor: contrada.colori.terziario,
                      }}
                    />
                  )}
                </div>

                <div className="inline-flex items-center rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-800 transition group-hover:bg-amber-200">
                  Scopri la Contrada →
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
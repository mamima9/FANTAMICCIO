"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">

        <section className="max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900">
              👋 Ciao Manuel!
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              Bentornato su FantaMiccio.
            </p>
          </div>

          {/* Card principali */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Contrada */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-1 transition">

              <h2 className="text-red-600 font-bold text-lg">
                ❤️ Contrada del Cuore
              </h2>

              <div className="my-6 flex justify-center">
                <Image
                  src="/contrade/cervia.png"
                  alt="Cervia"
                  width={90}
                  height={90}
                />
              </div>

              <h3 className="text-3xl font-extrabold text-amber-900">
                Cervia
              </h3>

            </div>

            {/* Classifica Contrada */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-1 transition">

              <h2 className="text-amber-700 font-bold text-lg">
                🏆 La tua Contrada
              </h2>

              <div className="mt-6">

                <p className="text-6xl font-extrabold">
                  2°
                </p>

                <p className="mt-2 text-green-600 font-semibold">
                  ▲ +1 posizione
                </p>

              </div>

            </div>

            {/* Badge */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-1 transition">

              <h2 className="text-blue-700 font-bold text-lg">
                🎖️ Badge
              </h2>

              <div className="mt-6">

                <p className="text-6xl font-extrabold">
                  0
                </p>

                <p className="text-gray-500">
                  Badge ottenuti
                </p>

              </div>

            </div>

          </div>

          {/* Classifica */}
          <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-amber-900 mb-8">
              📈 Classifica
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-amber-50 rounded-2xl p-6 text-center">

                <p className="text-gray-500">
                  ⭐ Punti
                </p>

                <p className="text-5xl font-extrabold text-amber-700 mt-3">
                  1.845
                </p>

              </div>

              <div className="bg-amber-50 rounded-2xl p-6 text-center">

                <p className="text-gray-500">
                  🥇 Posizione Generale
                </p>

                <p className="text-5xl font-extrabold mt-3">
                  15°
                </p>

                <p className="text-gray-500 mt-2">
                  su 126 giocatori
                </p>

              </div>

              <div className="bg-amber-50 rounded-2xl p-6 text-center">

                <p className="text-gray-500">
                  🛡️ Nella tua Contrada
                </p>

                <p className="text-5xl font-extrabold text-green-600 mt-3">
                  1°
                </p>

              </div>

            </div>

          </div>

          {/* Vita da Contrada */}
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-amber-500 p-10 shadow-2xl">

            <div className="md:flex justify-between items-center">

              <div>

                <h2 className="text-4xl font-extrabold text-white">
                  🎭 Vita da Contrada
                </h2>

                <p className="mt-4 text-white/90 max-w-xl text-lg">
                  Vivi l'esperienza completa di FantaMiccio.
                  Scopri tutte le competizioni dedicate alla tua Contrada,
                  affronta le altre e conquista nuovi badge.
                </p>

              </div>

              <div className="mt-8 md:mt-0">

                <Link
                  href="/vita-da-contrada"
                  className="inline-flex items-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-700 shadow-lg transition hover:scale-105"
                >
                  Entra →
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
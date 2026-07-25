"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contrade = [
  "Cervia",
  "Leon d'Oro",
  "Madonnina",
  "Ponte",
  "Ranocchio",
  "Lucertola",
  "Quercia",
  "Pozzo",
];

export default function RegistrazionePage() {
  const [contrada, setContrada] = useState("");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">

        <section className="max-w-3xl mx-auto px-6 py-16">

          <div className="text-center mb-12">

            <h1 className="text-5xl font-extrabold text-amber-900">
              Unisciti a FantaMiccio
            </h1>

            <p className="mt-5 text-lg text-gray-700">
              Crea gratuitamente il tuo account e vivi il Palio dei Micci tutto l'anno.
            </p>

          </div>

          <div className="rounded-3xl bg-white shadow-2xl p-8">

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="font-semibold">Nome</label>

                <input
                  type="text"
                  placeholder="Mario"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">Cognome</label>

                <input
                  type="text"
                  placeholder="Rossi"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Username</label>

                <input
                  type="text"
                  placeholder="Fantacontradaiolo"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Email</label>

                <input
                  type="email"
                  placeholder="nome@email.it"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">Password</label>

                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">Conferma Password</label>

                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div className="md:col-span-2">

                <label className="font-semibold">
                  Contrada del cuore
                </label>

                <select
                  value={contrada}
                  onChange={(e) => setContrada(e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option value="">Seleziona una Contrada</option>

                  {contrade.map((c) => (
                    <option key={c}>{c}</option>
                  ))}

                </select>

              </div>

            </div>

            <div className="mt-8 space-y-4">

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Accetto i Termini di Servizio
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Accetto la Privacy Policy
              </label>

            </div>

            <button
              onClick={() => alert("Registrazione disponibile prossimamente")}
              className="mt-10 w-full rounded-2xl bg-[#D4AF37] py-4 text-xl font-bold text-[#5C3A21] transition hover:scale-[1.02]"
            >
              🚀 Crea il mio account
            </button>

            <p className="mt-8 text-center text-gray-600">
              Hai già un account?
            </p>

            <div className="mt-4 flex justify-center">

              <a
                href="/login"
                className="font-bold text-amber-700 hover:underline"
              >
                Accedi
              </a>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
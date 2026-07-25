"use client";

import Image from "next/image";
import Link from "next/link";

const contrade = [
  { nome: "Cervia", stemma: "/contrade/cervia.png" },
  { nome: "Madonnina", stemma: "/contrade/madonnina.png" },
  { nome: "Leon d'Oro", stemma: "/contrade/leondoro.png" },
  { nome: "Ponte", stemma: "/contrade/ponte.png" },
  { nome: "Ranocchio", stemma: "/contrade/ranocchio.png" },
  { nome: "Pozzo", stemma: "/contrade/pozzo.png" },
  { nome: "Lucertola", stemma: "/contrade/lucertola.png" },
  { nome: "Quercia", stemma: "/contrade/quercia.png" },
];

export default function CorsaDelMiccio() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-900 via-red-700 to-yellow-600 text-white py-16">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h1 className="text-5xl font-black">
            🐴 Corsa del Miccio 2027
          </h1>

          <p className="mt-4 text-xl">
            Scegli quale Contrada conquisterà la vittoria.
          </p>

        </div>

      </section>

      {/* PRONOSTICO */}

      <section className="max-w-4xl mx-auto py-16 px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h2 className="text-4xl font-black text-center text-[#5C3A21] mb-10">
            Pronostico
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {contrade.map((contrada) => (
              <label
                key={contrada.nome}
                className="flex items-center gap-5 border-2 rounded-2xl p-5 cursor-pointer hover:bg-amber-50 hover:border-red-600 transition"
              >
                <input
                  type="radio"
                  name="contrada"
                  className="w-5 h-5"
                />

                <Image
                  src={contrada.stemma}
                  alt={contrada.nome}
                  width={60}
                  height={60}
                />

                <span className="text-xl font-bold">
                  {contrada.nome}
                </span>

              </label>
            ))}

          </div>

          <button
            className="mt-10 w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-2xl text-xl font-bold transition"
          >
            CONFERMA PRONOSTICO
          </button>

        </div>

      </section>

      {/* PUNTEGGI */}

      <section className="max-w-5xl mx-auto pb-20 px-6">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#5C3A21] text-white text-center py-5">

            <h2 className="text-3xl font-black">
              🏆 Punteggi
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-5 text-left">
                  Posizione
                </th>

                <th className="p-5 text-right">
                  Punti
                </th>
              </tr>

            </thead>

            <tbody>

              <tr className="border-b">
                <td className="p-5">🥇 Primo posto</td>
                <td className="p-5 text-right font-bold">100</td>
              </tr>

              <tr className="border-b">
                <td className="p-5">🥈 Secondo posto</td>
                <td className="p-5 text-right font-bold">60</td>
              </tr>

              <tr>
                <td className="p-5">🥉 Terzo posto</td>
                <td className="p-5 text-right font-bold">30</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      <div className="text-center pb-10">

        <Link
          href="/eventi"
          className="text-red-700 font-bold hover:underline"
        >
          ← Torna agli Eventi
        </Link>

      </div>

    </main>
  );
}
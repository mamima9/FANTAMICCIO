"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const stemmiContrade: Record<string, string> = {
  "Cervia": "/contrade/cervia.png",
  "Leon d'Oro": "/contrade/leondoro.png",
  "Lucertola": "/contrade/lucertola.png",
  "Madonnina": "/contrade/madonnina.png",
  "Ponte": "/contrade/ponte.png",
  "Pozzo": "/contrade/pozzo.png",
  "Quercia": "/contrade/quercia.png",
  "Ranocchio": "/contrade/ranocchio.png",
};

const coloriContrade: Record<
  string,
  { primario: string; secondario: string }
> = {
  Cervia: {
    primario: "#87CEEB",
    secondario: "#FFFFFF",
  },

  "Leon d'Oro": {
    primario: "#FFD700",
    secondario: "#D00000",
  },

  Lucertola: {
    primario: "#D00000",
    secondario: "#008000",
  },

  Madonnina: {
    primario: "#008CFF",
    secondario: "#FFD700",
  },

  Ponte: {
    primario: "#D00000",
    secondario: "#0057B8",
  },

  Pozzo: {
    primario: "#FFFFFF",
    secondario: "#D00000",
  },

  Quercia: {
    primario: "#FFFFFF",
    secondario: "#111111",
  },

  Ranocchio: {
    primario: "#FFD700",
    secondario: "#008000",
  },
};

const nomiContrade: Record<number, string> = {
  1: "Cervia",
  2: "Leon d'Oro",
  3: "Lucertola",
  4: "Madonnina",
  5: "Ponte",
  6: "Pozzo",
  7: "Quercia",
  8: "Ranocchio",
};

export default function ClassificaContradaPage() {
  const supabase = createClient();

  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContrada, setSelectedContrada] = useState(1);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      // PRENDIAMO GLI UTENTI E I LORO PUNTI
      const { data: predictions, error: predictionsError } =
        await supabase
          .from("predictions")
          .select(`
            points_awarded,
            profiles (
              username,
              contrada_id
            )
          `);

      if (predictionsError) {
        console.error("Errore predictions:", predictionsError);
        setLoading(false);
        return;
      }

      // CREIAMO LE 8 CONTRADE
      const contrade: Record<number, any[]> = {};

      Object.keys(nomiContrade).forEach((id) => {
        contrade[Number(id)] = [];
      });

      // RAGGRUPPIAMO GLI UTENTI PER CONTRADA
      predictions?.forEach((prediction: any) => {
        const profile = prediction.profiles;

        if (!profile) return;
        if (!profile.contrada_id) return;

        const contradaId = Number(profile.contrada_id);

        if (!contrade[contradaId]) {
          contrade[contradaId] = [];
        }

        const existing = contrade[contradaId].find(
          (utente: any) =>
            utente.username === profile.username
        );

        if (existing) {
          existing.punti +=
            Number(prediction.points_awarded) || 0;
        } else {
          contrade[contradaId].push({
            username: profile.username,
            punti:
              Number(prediction.points_awarded) || 0,
          });
        }
      });

      // ORDINIAMO GLI UTENTI DI OGNI CONTRADA
      Object.keys(contrade).forEach((id) => {
        contrade[Number(id)].sort(
          (a: any, b: any) =>
            b.punti - a.punti
        );
      });

      const result = Object.keys(contrade).map(
        (id) => ({
          id: Number(id),
          nome: nomiContrade[Number(id)],
          utenti: contrade[Number(id)],
        })
      );

      setRanking(result);
      setLoading(false);
    }

    loadRanking();
  }, []);

  const contradaSelezionata = ranking.find(
    (contrada) =>
      contrada.id === selectedContrada
  );

  const nomeContrada =
    nomiContrade[selectedContrada];

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#8B0000] via-red-700 to-[#D4AF37] text-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-between items-center flex-wrap gap-6">

            <div>
              <h1 className="text-5xl font-black">
                🚩 Classifica Contrada
              </h1>

              <p className="mt-3 text-xl text-red-100">
                Scopri la classifica interna di ogni contrada.
              </p>
            </div>

            <Link
              href="/dashboard/classifiche"
              className="bg-white text-red-700 font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              ← Classifiche
            </Link>

          </div>

        </div>

      </section>

      {/* SELETTORE CONTRADE */}

      <section className="max-w-7xl mx-auto px-6 pt-10">

        <div className="flex gap-3 overflow-x-auto pb-3">

          {Object.entries(nomiContrade).map(
            ([id, nome]) => (

              <button
                key={id}
                onClick={() =>
                  setSelectedContrada(Number(id))
                }
                className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition ${
                  selectedContrada === Number(id)
                    ? "bg-[#5C3A21] text-white shadow-lg scale-105"
                    : "bg-white text-[#5C3A21] shadow hover:scale-105"
                }`}
              >
                {nome}
              </button>

            )
          )}

        </div>

      </section>

      {/* CLASSIFICA */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            Caricamento...
          </div>

        ) : (

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* HEADER CONTRADA */}

            <div
              className="p-6"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${
                    coloriContrade[nomeContrada]?.primario ??
                    "#5C3A21"
                  },
                  ${
                    coloriContrade[nomeContrada]?.secondario ??
                    "#D4AF37"
                  }
                )`,
              }}
            >

              <div className="flex items-center gap-4">

                {stemmiContrade[nomeContrada] && (
                  <Image
                    src={stemmiContrade[nomeContrada]}
                    alt={`Stemma ${nomeContrada}`}
                    width={75}
                    height={75}
                    className="object-contain"
                  />
                )}

                <div>

                  <p className="text-sm font-bold uppercase opacity-70">
                    Classifica interna
                  </p>

                  <h2 className="text-4xl font-black text-[#5C3A21]">
                    {nomeContrada}
                  </h2>

                </div>

              </div>

            </div>

            {/* TABELLA */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[500px]">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-5 text-left">
                      #
                    </th>

                    <th className="p-5 text-left">
                      Contradaiolo
                    </th>

                    <th className="p-5 text-right">
                      Punti
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {!contradaSelezionata ||
                  contradaSelezionata.utenti.length === 0 ? (

                    <tr>

                      <td
                        colSpan={3}
                        className="p-10 text-center text-gray-500"
                      >
                        Nessun partecipante
                      </td>

                    </tr>

                  ) : (

                    contradaSelezionata.utenti.map(
                      (
                        utente: any,
                        index: number
                      ) => (

                        <tr
                          key={utente.username}
                          className="border-b hover:bg-amber-50 transition"
                        >

                          <td className="p-5 font-bold">
                            {index + 1}
                          </td>

                          <td className="p-5">

                            <div className="flex items-center gap-3">

                              {stemmiContrade[nomeContrada] && (
                                <Image
                                  src={
                                    stemmiContrade[
                                      nomeContrada
                                    ]
                                  }
                                  alt={`Stemma ${nomeContrada}`}
                                  width={45}
                                  height={45}
                                  className="object-contain"
                                />
                              )}

                              <span className="font-semibold">
                                {utente.username}
                              </span>

                            </div>

                          </td>

                          <td className="p-5 text-right font-black text-lg">
                            {utente.punti}
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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

const stemmiContrade: Record<string, string> = {
  Cervia: "/contrade/cervia.png",
  "Leon d'Oro": "/contrade/leondoro.png",
  Lucertola: "/contrade/lucertola.png",
  Madonnina: "/contrade/madonnina.png",
  Ponte: "/contrade/ponte.png",
  Pozzo: "/contrade/pozzo.png",
  Quercia: "/contrade/quercia.png",
  Ranocchio: "/contrade/ranocchio.png",
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

type Utente = {
  username: string;
  punti: number;
};

type Contrada = {
  id: number;
  nome: string;
  utenti: Utente[];
};

export default function ClassificaContradaPage() {
  const supabase = createClient();

  const [ranking, setRanking] = useState<Contrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContrada, setSelectedContrada] = useState(1);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      /*
       * 1. PRENDIAMO TUTTI I PROFILI
       *
       * In questo modo sappiamo con certezza:
       * username -> contrada_id
       */
      const { data: profiles, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, username, contrada_id");

      if (profilesError) {
        console.error(
          "Errore caricamento profiles:",
          profilesError
        );
        setLoading(false);
        return;
      }

      /*
       * 2. PRENDIAMO TUTTE LE PREDICTIONS
       */
      const { data: predictions, error: predictionsError } =
        await supabase
          .from("predictions")
          .select(
            "user_id, points_awarded"
          );

      if (predictionsError) {
        console.error(
          "Errore caricamento predictions:",
          predictionsError
        );
        setLoading(false);
        return;
      }

      /*
       * 3. CREIAMO LE 8 CONTRADE
       */
      const contrade: Record<number, Contrada> = {};

      Object.entries(nomiContrade).forEach(
        ([id, nome]) => {
          contrade[Number(id)] = {
            id: Number(id),
            nome,
            utenti: [],
          };
        }
      );

      /*
       * 4. CALCOLIAMO I PUNTI PER UTENTE
       */
      const puntiUtenti: Record<
        string,
        number
      > = {};

      predictions?.forEach((prediction: any) => {
        const userId = prediction.user_id;

        if (!userId) return;

        if (!puntiUtenti[userId]) {
          puntiUtenti[userId] = 0;
        }

        puntiUtenti[userId] +=
          Number(prediction.points_awarded) || 0;
      });

      /*
       * 5. COLLEGHIAMO PROFILO -> CONTRADA
       */
      profiles?.forEach((profile: any) => {
        if (!profile.contrada_id) return;

        const contradaId =
          Number(profile.contrada_id);

        if (!contrade[contradaId]) return;

        contrade[contradaId].utenti.push({
          username:
            profile.username ?? "Utente",
          punti:
            puntiUtenti[profile.id] ?? 0,
        });
      });

      /*
       * 6. ORDINIAMO GLI UTENTI
       */
      Object.values(contrade).forEach(
        (contrada) => {
          contrada.utenti.sort(
            (a, b) => b.punti - a.punti
          );
        }
      );

      setRanking(
        Object.values(contrade)
      );

      setLoading(false);
    }

    loadRanking();
  }, []);

  const contradaSelezionata =
    ranking.find(
      (contrada) =>
        contrada.id === selectedContrada
    );

  const nomeContrada =
    nomiContrade[selectedContrada];

  const colori =
    coloriContrade[nomeContrada] ?? {
      primario: "#5C3A21",
      secondario: "#D4AF37",
    };

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#5C3A21] via-[#7A4A25] to-[#D4AF37] text-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-between items-center flex-wrap gap-6">

            <div>

              <h1 className="text-5xl font-black">
                🚩 Classifica Contrada
              </h1>

              <p className="mt-3 text-xl text-amber-100">
                La classifica interna di ogni contrada.
              </p>

            </div>

            <Link
              href="/dashboard/classifiche"
              className="bg-white text-[#5C3A21] font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
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
            ([id, nome]) => {

              const contradaId =
                Number(id);

              return (
                <button
                  key={contradaId}
                  onClick={() =>
                    setSelectedContrada(
                      contradaId
                    )
                  }
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition ${
                    selectedContrada ===
                    contradaId
                      ? "bg-[#5C3A21] text-white shadow-lg scale-105"
                      : "bg-white text-[#5C3A21] shadow hover:scale-105"
                  }`}
                >
                  {nome}
                </button>
              );
            }
          )}

        </div>

      </section>

      {/* CONTENUTO */}

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
                  ${colori.primario},
                  ${colori.secondario}
                )`,
              }}
            >

              <div className="flex items-center gap-4">

                {stemmiContrade[
                  nomeContrada
                ] && (

                  <Image
                    src={
                      stemmiContrade[
                        nomeContrada
                      ]
                    }
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
                  contradaSelezionata.utenti
                    .length === 0 ? (

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
                        utente,
                        index
                      ) => (

                        <tr
                          key={
                            utente.username
                          }
                          className="border-b hover:bg-amber-50 transition"
                        >

                          <td className="p-5 font-bold">
                            {index + 1}
                          </td>

                          <td className="p-5">

                            <div className="flex items-center gap-3">

                              {stemmiContrade[
                                nomeContrada
                              ] && (

                                <Image
                                  src={
                                    stemmiContrade[
                                      nomeContrada
                                    ]
                                  }
                                  alt=""
                                  width={45}
                                  height={45}
                                  className="object-contain"
                                />

                              )}

                              <span className="font-semibold">
                                {
                                  utente.username
                                }
                              </span>

                            </div>

                          </td>

                          <td className="p-5 text-right font-black text-lg">
                            {
                              utente.punti
                            }
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
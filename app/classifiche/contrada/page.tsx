"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const stemmiContrade: Record<string, string> = {
  "1": "/contrade/cervia.png",
  "2": "/contrade/leondoro.png",
  "3": "/contrade/lucertola.png",
  "4": "/contrade/madonnina.png",
  "5": "/contrade/ponte.png",
  "6": "/contrade/pozzo.png",
  "7": "/contrade/quercia.png",
  "8": "/contrade/ranocchio.png",
};

const nomiContrade: Record<string, string> = {
  "1": "Cervia",
  "2": "Leon d'Oro",
  "3": "Lucertola",
  "4": "Madonnina",
  "5": "Ponte",
  "6": "Pozzo",
  "7": "Quercia",
  "8": "Ranocchio",
};

/* COLORI DELLE CONTRADE */

const coloriContrade: Record<
  string,
  {
    primario: string;
    secondario: string;
  }
> = {
  Cervia: {
    primario: "#FFFFFF",
    secondario: "#87CEEB",
  },

  "Leon d'Oro": {
    primario: "#FFD700",
    secondario: "#D71920",
  },

  Lucertola: {
    primario: "#D71920",
    secondario: "#16823B",
  },

  Madonnina: {
    primario: "#1E5AA8",
    secondario: "#FFD700",
  },

  Ponte: {
    primario: "#D71920",
    secondario: "#1E5AA8",
  },

  Pozzo: {
    primario: "#FFFFFF",
    secondario: "#D71920",
  },

  Quercia: {
    primario: "#FFFFFF",
    secondario: "#171717",
  },

  Ranocchio: {
    primario: "#FFD700",
    secondario: "#16823B",
  },
};

type Utente = {
  username: string;
  contrada_id: string;
  punti: number;
};

type Contrada = {
  id: string;
  nome: string;
  utenti: Utente[];
};

export default function ContradaPage() {
  const [ranking, setRanking] = useState<Contrada[]>([]);
  const [selectedContrada, setSelectedContrada] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          points_awarded,
          profiles (
            username,
            contrada_id
          )
        `);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const contrade: Record<string, Contrada> = {};

      Object.keys(nomiContrade).forEach((id) => {
        contrade[id] = {
          id,
          nome: nomiContrade[id],
          utenti: [],
        };
      });

      data?.forEach((prediction: any) => {
        const profile = Array.isArray(prediction.profiles)
          ? prediction.profiles[0]
          : prediction.profiles;

        if (!profile?.username || !profile?.contrada_id) {
          return;
        }

        const id = String(profile.contrada_id);

        if (!contrade[id]) {
          return;
        }

        const punti =
          Number(prediction.points_awarded) || 0;

        const utenteEsistente = contrade[id].utenti.find(
          (utente) => utente.username === profile.username
        );

        if (utenteEsistente) {
          utenteEsistente.punti += punti;
        } else {
          contrade[id].utenti.push({
            username: profile.username,
            contrada_id: id,
            punti,
          });
        }
      });

      Object.values(contrade).forEach((contrada) => {
        contrada.utenti.sort(
          (a, b) => b.punti - a.punti
        );
      });

      setRanking(Object.values(contrade));
      setLoading(false);
    }

    loadRanking();
  }, []);

  const contrada = ranking.find(
    (item) => item.id === selectedContrada
  );

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
            🚩 Singola Contrada
          </h1>

          <p className="text-base md:text-xl text-amber-100 mt-3 max-w-2xl">
            La classifica interna di ogni contrada.
          </p>

        </div>

      </section>


      {/* CONTENUTO */}

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            Caricamento...
          </div>

        ) : (

          <>

            {/* SELETTORE CONTRADE */}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3 mb-8">

              {ranking.map((item) => (

                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedContrada(item.id)
                  }
                  className={`p-3 rounded-2xl font-bold transition ${
                    selectedContrada === item.id
                      ? "bg-[#5C3A21] text-white shadow-lg scale-[1.02]"
                      : "bg-white text-[#5C3A21] shadow hover:bg-amber-50"
                  }`}
                >

                  <div className="flex justify-center mb-1">

                    <Image
                      src={stemmiContrade[item.id]}
                      alt={`Stemma ${item.nome}`}
                      width={38}
                      height={38}
                      className="object-contain"
                    />

                  </div>

                  <span className="text-xs md:text-sm">
                    {item.nome}
                  </span>

                </button>

              ))}

            </div>


            {/* CONTRADA SELEZIONATA */}

            {contrada && (

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* HEADER SFUMATO */}

                <div
                  className="p-6 md:p-8"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${
                        coloriContrade[contrada.nome]?.primario ??
                        "#5C3A21"
                      },
                      ${
                        coloriContrade[contrada.nome]?.secondario ??
                        "#D4AF37"
                      }
                    )`,
                  }}
                >

                  <div className="flex items-center gap-4">

                    {/* STEMMA */}

                    <div className="bg-white/80 rounded-2xl p-2 flex-shrink-0">

                      <Image
                        src={stemmiContrade[contrada.id]}
                        alt={`Stemma ${contrada.nome}`}
                        width={70}
                        height={70}
                        className="object-contain"
                      />

                    </div>


                    {/* NOME */}

                    <div>

                      <h2 className="text-2xl md:text-4xl font-black text-[#5C3A21]">
                        {contrada.nome}
                      </h2>

                      <p className="text-[#5C3A21] font-semibold mt-1">
                        Classifica interna
                      </p>

                    </div>

                  </div>

                </div>


                {/* TABELLA */}

                {contrada.utenti.length === 0 ? (

                  <div className="p-10 text-center">

                    <div className="text-5xl mb-4">
                      🚩
                    </div>

                    <p className="text-gray-500 font-medium">
                      Nessun partecipante in questa contrada.
                    </p>

                  </div>

                ) : (

                  <div>

                    {/* INTESTAZIONE */}

                    <div className="hidden md:grid grid-cols-[60px_minmax(0,1fr)_120px] items-center gap-4 bg-gray-100 px-6 py-4 text-sm font-black text-gray-600">

                      <div>
                        #
                      </div>

                      <div>
                        Contradaiolo
                      </div>

                      <div className="text-right">
                        Punti
                      </div>

                    </div>


                    {/* UTENTI */}

                    {contrada.utenti.map(
                      (utente, index) => (

                        <div
                          key={utente.username}
                          className="border-b last:border-b-0 px-4 md:px-6 py-4 md:py-5 hover:bg-amber-50 transition"
                        >

                          <div className="grid grid-cols-[32px_42px_minmax(0,1fr)_auto] md:grid-cols-[60px_minmax(0,1fr)_120px] items-center gap-3 md:gap-4">

                            {/* POSIZIONE */}

                            <div className="font-black text-lg">
                              {index + 1}
                            </div>


                            {/* STEMMA */}

                            <div className="md:hidden">

                              <Image
                                src={
                                  stemmiContrade[
                                    utente.contrada_id
                                  ]
                                }
                                alt=""
                                width={38}
                                height={38}
                                className="object-contain"
                              />

                            </div>


                            {/* UTENTE */}

                            <div className="font-bold text-[#5C3A21] min-w-0 break-words">

                              <span>
                                {utente.username}
                              </span>

                            </div>


                            {/* PUNTI */}

                            <div className="font-black text-lg whitespace-nowrap">

                              {utente.punti} pt

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </>

        )}

      </section>

    </main>
  );
}
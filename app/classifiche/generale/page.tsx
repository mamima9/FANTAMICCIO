"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

type Utente = {
  username: string;
  contrada_id: string;
  punti: number;
};

export default function Generale() {
  const supabase = createClient();

  const [ranking, setRanking] = useState<Utente[]>([]);
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

      const users: Record<string, Utente> = {};

      data?.forEach((prediction: any) => {
        const profile = prediction.profiles;

        if (!profile) return;

        const username = profile.username;

        if (!users[username]) {
          users[username] = {
            username,
            contrada_id: String(
              profile.contrada_id ?? ""
            ),
            punti: 0,
          };
        }

        users[username].punti +=
          Number(prediction.points_awarded) || 0;
      });

      const sorted = Object.values(users).sort(
        (a, b) => b.punti - a.punti
      );

      setRanking(sorted);
      setLoading(false);
    }

    loadRanking();
  }, []);

  const podio = ranking.slice(0, 3);
  const resto = ranking.slice(3);

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#5C3A21] via-[#7A4A25] to-[#D4AF37] text-white py-12 md:py-16">

        <div className="max-w-7xl mx-auto px-5">

          <Link
            href="/classifiche"
            className="inline-block mb-6 text-amber-200 font-bold"
          >
            ← Classifiche
          </Link>

          <p className="text-amber-200 font-bold uppercase tracking-widest text-sm">
            FantaMiccio
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-2">
            🏆 Classifica Generale
          </h1>

          <p className="text-base md:text-xl text-amber-100 mt-3">
            La classifica generale dei contradaioli.
          </p>

        </div>

      </section>

      {/* CONTENUTO */}

      <section className="max-w-7xl mx-auto px-5 py-10">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            Caricamento...
          </div>

        ) : ranking.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-gray-500">
            Nessun punteggio disponibile.
          </div>

        ) : (

          <>
            {/* PODIO */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

              {podio.map((utente, index) => {

                const posizione = index + 1;

                return (
                  <div
                    key={utente.username}
                    className="bg-white rounded-3xl shadow-xl p-6 text-center"
                  >

                    <div className="text-4xl mb-3">
                      {posizione === 1
                        ? "🥇"
                        : posizione === 2
                        ? "🥈"
                        : "🥉"}
                    </div>

                    <div className="text-2xl font-black text-[#5C3A21]">
                      {utente.username}
                    </div>

                    {/* STEMMA */}

                    {stemmiContrade[
                      utente.contrada_id
                    ] && (
                      <div className="flex justify-center mt-4">

                        <Image
                          src={
                            stemmiContrade[
                              utente.contrada_id
                            ]
                          }
                          alt="Stemma contrada"
                          width={65}
                          height={65}
                          className="object-contain"
                        />

                      </div>
                    )}

                    <div className="mt-4 text-2xl font-black">
                      {utente.punti} pt
                    </div>

                  </div>
                );
              })}

            </div>

            {/* CLASSIFICA */}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              <div className="bg-[#5C3A21] text-white p-6">

                <h2 className="text-2xl md:text-3xl font-black">
                  Classifica
                </h2>

              </div>

              <div>

                {resto.map((utente, index) => {

                  const posizione = index + 4;

                  return (
                    <div
                      key={utente.username}
                      className="border-b last:border-b-0 p-5"
                    >

                      <div className="flex items-center gap-4">

                        <div className="font-black text-lg w-8">
                          {posizione}
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="font-bold text-[#5C3A21] truncate">
                            {utente.username}
                          </div>

                        </div>

                        {stemmiContrade[
                          utente.contrada_id
                        ] && (
                          <Image
                            src={
                              stemmiContrade[
                                utente.contrada_id
                              ]
                            }
                            alt="Stemma contrada"
                            width={45}
                            height={45}
                            className="object-contain flex-shrink-0"
                          />
                        )}

                        <div className="font-black text-lg whitespace-nowrap">
                          {utente.punti} pt
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          </>
        )}

      </section>

    </main>
  );
}
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

        if (!profile?.username || !profile?.contrada_id) return;

        const id = String(profile.contrada_id);

        if (!contrade[id]) return;

        const existing = contrade[id].utenti.find(
          (utente) => utente.username === profile.username
        );

        if (existing) {
          existing.punti +=
            Number(prediction.points_awarded) || 0;
        } else {
          contrade[id].utenti.push({
            username: profile.username,
            contrada_id: id,
            punti:
              Number(prediction.points_awarded) || 0,
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

          <p className="text-base md:text-xl text-amber-100 mt-3">
            La classifica interna di ogni contrada.
          </p>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">

        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            Caricamento...
          </div>
        ) : (
          <>

            {/* SELETTORE */}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3 mb-8">

              {ranking.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedContrada(item.id)
                  }
                  className={`p-3 rounded-2xl font-bold transition ${
                    selectedContrada === item.id
                      ? "bg-[#5C3A21] text-white shadow-lg"
                      : "bg-white text-[#5C3A21] shadow hover:bg-amber-50"
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <Image
                      src={stemmiContrade[item.id]}
                      alt=""
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


            {/* CONTRADA */}

            {contrada && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                <div className="bg-[#5C3A21] text-white p-6">

                  <div className="flex items-center gap-4">

                    <Image
                      src={stemmiContrade[contrada.id]}
                      alt={`Stemma ${contrada.nome}`}
                      width={65}
                      height={65}
                      className="object-contain"
                    />

                    <div>
                      <h2 className="text-2xl md:text-3xl font-black">
                        {contrada.nome}
                      </h2>

                      <p className="text-amber-200">
                        Classifica interna
                      </p>
                    </div>

                  </div>

                </div>


                {contrada.utenti.length === 0 ? (

                  <div className="p-10 text-center text-gray-500">
                    Nessun partecipante.
                  </div>

                ) : (

                  <div>

                    {contrada.utenti.map((utente, index) => (

                      <div
                        key={utente.username}
                        className="border-b last:border-b-0 p-4 md:p-5"
                      >

                        <div className="grid grid-cols-[32px_48px_minmax(0,1fr)_auto] items-center gap-3 md:gap-4">

                          <div className="font-black">
                            {index + 1}
                          </div>

                          <Image
                            src={stemmiContrade[utente.contrada_id]}
                            alt=""
                            width={42}
                            height={42}
                            className="object-contain"
                          />

                          <div className="font-bold text-[#5C3A21] break-words min-w-0">
                            {utente.username}
                          </div>

                          <div className="font-black whitespace-nowrap">
                            {utente.punti} pt
                          </div>

                        </div>

                      </div>

                    ))}

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
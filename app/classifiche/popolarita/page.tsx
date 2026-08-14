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

type Contrada = {
  id: string;
  nome: string;
  iscritti: number;
};

export default function PopolaritaPage() {
  const supabase = createClient();

  const [ranking, setRanking] = useState<Contrada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopolarita() {
      const { data, error } = await supabase
        .from("profiles")
        .select("contrada_id");

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
          iscritti: 0,
        };
      });

      data?.forEach((profile: any) => {
        if (!profile?.contrada_id) return;

        const id = String(profile.contrada_id);

        if (!contrade[id]) return;

        contrade[id].iscritti++;
      });

      const sorted = Object.values(contrade).sort(
        (a, b) => b.iscritti - a.iscritti
      );

      setRanking(sorted);
      setLoading(false);
    }

    loadPopolarita();
  }, []);

  const podio = ranking.slice(0, 3);

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
            ⭐ Popolarità
          </h1>

          <p className="text-base md:text-xl text-amber-100 mt-3">
            Le 8 contrade classificate per numero di Fantacontradaioli
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
            {/* PODIO */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

              {podio.map((contrada, index) => (
                <div
                  key={contrada.id}
                  className="bg-white rounded-3xl shadow-xl p-6 text-center"
                >

                  <div className="text-4xl mb-3">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : "🥉"}
                  </div>

                  <div className="flex justify-center mb-4">
                    <Image
                      src={stemmiContrade[contrada.id]}
                      alt={`Stemma ${contrada.nome}`}
                      width={85}
                      height={85}
                      className="object-contain"
                    />
                  </div>

                  <h2 className="text-2xl font-black text-[#5C3A21]">
                    {contrada.nome}
                  </h2>

                  <p className="mt-2 text-lg font-bold text-gray-600">
                    {contrada.iscritti}{" "}
                    {contrada.iscritti === 1
                      ? "iscritto"
                      : "iscritti"}
                  </p>

                </div>
              ))}

            </div>

            {/* CLASSIFICA */}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              <div className="bg-[#5C3A21] text-white p-6">
                <h2 className="text-2xl md:text-3xl font-black">
                  Classifica Popolarità
                </h2>
              </div>

              {ranking.map((contrada, index) => (
                <div
                  key={contrada.id}
                  className="border-b last:border-b-0 p-4 md:p-5"
                >

                  <div className="grid grid-cols-[32px_48px_minmax(0,1fr)_auto] items-center gap-3 md:gap-4">

                    <div className="font-black">
                      {index + 1}
                    </div>

                    <Image
                      src={stemmiContrade[contrada.id]}
                      alt={`Stemma ${contrada.nome}`}
                      width={45}
                      height={45}
                      className="object-contain"
                    />

                    <div className="font-bold text-[#5C3A21] min-w-0 break-words">
                      {contrada.nome}
                    </div>

                    <div className="font-black whitespace-nowrap">
                      {contrada.iscritti}
                    </div>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </section>

    </main>
  );
}
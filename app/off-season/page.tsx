"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BENIAMINI_MAPPA,
  NPCS,
} from "@/data/offSeason";

const supabase = createClient();

export default function OffSeasonPage() {
  const [owned, setOwned] = useState<string[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<any>(null);
  const [selectedBeniamino, setSelectedBeniamino] =
    useState<any>(null);

  const [loading, setLoading] = useState(true);

  async function loadCollection() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("user_beniamini")
      .select("beniamino_id")
      .eq("user_id", user.id);

    setOwned(
      (data ?? []).map(
        (item) => item.beniamino_id
      )
    );

    setLoading(false);
  }

  useEffect(() => {
    loadCollection();
  }, []);

  async function collectBeniamino(
    beniaminoId: string
  ) {
    if (owned.includes(beniaminoId)) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Devi effettuare il login.");
      return;
    }

    const { error } = await supabase
      .from("user_beniamini")
      .insert({
        user_id: user.id,
        beniamino_id: beniaminoId,
      });

    if (error) {
      if (
        !error.message
          .toLowerCase()
          .includes("duplicate")
      ) {
        alert(error.message);
      }

      return;
    }

    setOwned((current) => [
      ...current,
      beniaminoId,
    ]);

    const found = BENIAMINI_MAPPA.find(
      (b) => b.id === beniaminoId
    );

    setSelectedBeniamino(found);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
        <p className="font-black text-xl">
          Preparazione della mappa...
        </p>
      </main>
    );
  }

  const progress = owned.filter((id) =>
    BENIAMINI_MAPPA.some((b) => b.id === id)
  ).length;

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HEADER */}

      <section className="bg-[#5C3A21] text-white">
        <div className="max-w-7xl mx-auto px-5 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-amber-300 font-bold uppercase tracking-widest text-sm">
                Off Season 2026 · Parte 2
              </p>

              <h1 className="text-4xl md:text-6xl font-black mt-2">
                🤝 Tregua tra Contrade
              </h1>

              <p className="mt-3 text-amber-100">
                Esplora Querceta. Segui gli indizi.
                Trova gli 8 Beniamini.
              </p>

            </div>

            <Link
              href="/tregua"
              className="rounded-2xl bg-[#D4AF37] px-6 py-4 text-center font-black text-[#5C3A21]"
            >
              {progress}/8 Beniamini
            </Link>

          </div>

        </div>
      </section>


      {/* MAPPA */}

      <section className="max-w-7xl mx-auto px-5 py-8">

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]">

          <div
            className="relative w-full"
            style={{
              height: "70vh",
              minHeight: "550px",
            }}
          >

            <iframe
              title="Mappa Tregua tra Contrade"
              className="absolute inset-0 w-full h-full border-0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=10.175%2C43.945%2C10.235%2C43.995&layer=mapnik"
            />

            {/* NPC BUTTONS */}

            {NPCS.map((npc) => {

              const left =
                ((npc.coordinates[1] - 10.175) /
                  (10.235 - 10.175)) *
                100;

              const top =
                (1 -
                  (npc.coordinates[0] - 43.945) /
                    (43.995 - 43.945)) *
                100;

              return (
                <button
                  key={npc.id}
                  onClick={() =>
                    setSelectedNpc(npc)
                  }
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >

                  <div className="bg-[#5C3A21] text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-xl border-2 border-white group-hover:scale-110 transition">
                    🧙
                  </div>

                  <span className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg text-xs font-black shadow">
                    NPC
                  </span>

                </button>
              );
            })}


            {/* BENIAMINI */}

            {BENIAMINI_MAPPA.map((beniamino) => {

              const collected =
                owned.includes(beniamino.id);

              const left =
                ((beniamino.coordinates[1] - 10.175) /
                  (10.235 - 10.175)) *
                100;

              const top =
                (1 -
                  (beniamino.coordinates[0] - 43.945) /
                    (43.995 - 43.945)) *
                100;

              return (
                <button
                  key={beniamino.id}
                  onClick={() =>
                    collectBeniamino(beniamino.id)
                  }
                  disabled={collected}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >

                  <div
                    className={`
                      w-14 h-14 rounded-full
                      bg-white border-4
                      border-[#D4AF37]
                      shadow-2xl p-1
                      transition
                      ${
                        collected
                          ? "opacity-40 grayscale"
                          : "animate-pulse hover:scale-125"
                      }
                    `}
                  >

                    <Image
                      src={beniamino.image}
                      alt={beniamino.nome}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />

                  </div>

                  {!collected && (
                    <span className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#D4AF37] text-[#5C3A21] px-2 py-1 rounded-lg text-xs font-black shadow">
                      TROVAMI
                    </span>
                  )}

                </button>
              );
            })}

          </div>

        </div>


        {/* ISTRUZIONI */}

        <div className="grid md:grid-cols-3 gap-5 mt-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-4xl">🗺️</div>
            <h2 className="text-xl font-black mt-3">
              Esplora
            </h2>
            <p className="text-gray-600 mt-2">
              Esplora il territorio di Querceta e
              trova gli NPC.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-4xl">🧩</div>
            <h2 className="text-xl font-black mt-3">
              Segui gli indizi
            </h2>
            <p className="text-gray-600 mt-2">
              Gli NPC custodiscono gli indizi
              per trovare i Beniamini.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-4xl">🤝</div>
            <h2 className="text-xl font-black mt-3">
              Completa la Tregua
            </h2>
            <p className="text-gray-600 mt-2">
              Dopo gli 8 Beniamini vai alla pagina
              Tregua e cerca un'altra Contrada.
            </p>
          </div>

        </div>

      </section>


      {/* NPC MODAL */}

      {selectedNpc && (

        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-5"
          onClick={() => setSelectedNpc(null)}
        >

          <div
            className="bg-[#F8F5F0] rounded-3xl max-w-lg w-full p-7 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="text-5xl">
              🧙
            </div>

            <h2 className="text-3xl font-black text-[#5C3A21] mt-3">
              {selectedNpc.nome}
            </h2>

            <p className="mt-5 text-lg text-gray-700">
              {selectedNpc.text}
            </p>

            <div className="mt-5 bg-[#D4AF37]/20 rounded-2xl p-5">
              <p className="text-sm font-black uppercase text-[#5C3A21]">
                🔎 Indizio
              </p>

              <p className="mt-2 font-bold">
                {selectedNpc.clue}
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedNpc(null)
              }
              className="mt-6 w-full bg-[#5C3A21] text-white rounded-xl py-3 font-black"
            >
              Continua
            </button>

          </div>

        </div>

      )}


      {/* BENIAMINO TROVATO */}

      {selectedBeniamino && (

        <div
          className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-5"
          onClick={() =>
            setSelectedBeniamino(null)
          }
        >

          <div
            className="bg-white rounded-3xl max-w-md w-full p-7 text-center shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="text-5xl">
              🎉
            </div>

            <h2 className="text-3xl font-black text-[#5C3A21] mt-3">
              Beniamino trovato!
            </h2>

            <Image
              src={selectedBeniamino.image}
              alt={selectedBeniamino.nome}
              width={180}
              height={180}
              className="mx-auto mt-5 object-contain"
            />

            <p className="text-2xl font-black mt-3">
              {selectedBeniamino.nome}
            </p>

            <p className="text-gray-600 mt-2">
              {owned.length + 1}/8
            </p>

            <button
              onClick={() =>
                setSelectedBeniamino(null)
              }
              className="mt-6 w-full bg-[#D4AF37] rounded-xl py-3 font-black text-[#5C3A21]"
            >
              Fantastico!
            </button>

          </div>

        </div>

      )}

    </main>
  );
}
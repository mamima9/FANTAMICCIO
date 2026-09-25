"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BENIAMINI } from "@/data/beniamini";

const supabase = createClient();

type Profile = {
  id: string;
  username: string;
  contrada_id: string | number | null;
};

type ExchangeRequest = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  requester?: {
    username: string;
    contrada_id: string | number | null;
  };
};

const CONTRADE: Record<string, string> = {
  "1": "Cervia",
  "2": "Leon d'Oro",
  "3": "Lucertola",
  "4": "Madonnina",
  "5": "Ponte",
  "6": "Pozzo",
  "7": "Quercia",
  "8": "Ranocchio",
};

export default function TreguaPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [owned, setOwned] = useState<string[]>([]);

  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const [incoming, setIncoming] = useState<ExchangeRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, username, contrada_id")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile({
        ...profileData,
        contrada_id:
          profileData.contrada_id !== null
            ? String(profileData.contrada_id)
            : null,
      });
    }

    const { data: beniamini } = await supabase
      .from("user_beniamini")
      .select("beniamino_id")
      .eq("user_id", user.id);

    setOwned(
      (beniamini ?? []).map((item) => item.beniamino_id)
    );

    const { data: requests } = await supabase
      .from("exchange_requests")
      .select(`
        id,
        requester_id,
        receiver_id,
        status,
        created_at,
        requester:profiles!exchange_requests_requester_id_fkey(
          username,
          contrada_id
        )
      `)
      .eq("receiver_id", user.id)
      .eq("status", "pending")
      .order("created_at", {
        ascending: false,
      });

    setIncoming((requests ?? []) as any);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const hasAllEight =
    owned.filter((id) => id !== "barone").length === 8;

  const hasBarone = owned.includes("barone");

  const completed =
    owned.length === 9 && hasBarone;

  async function searchUser() {
    setSearchResult(null);

    const value = username.trim();

    if (!value) return;

    setSearching(true);

    const { data: user } = await supabase
      .from("profiles")
      .select("id, username, contrada_id")
      .ilike("username", value)
      .maybeSingle();

    setSearching(false);

    if (!user) {
      setSearchResult({
        error: "Utente non trovato.",
      });
      return;
    }

    if (user.id === profile?.id) {
      setSearchResult({
        error: "Non puoi fare uno scambio con te stesso.",
      });
      return;
    }

    if (
      String(user.contrada_id) ===
      String(profile?.contrada_id)
    ) {
      setSearchResult({
        error:
          "Lo scambio deve essere fatto con un'altra Contrada.",
      });
      return;
    }

    setSearchResult(user);
  }

  async function sendExchange() {
    if (!searchResult || searchResult.error) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSending(false);
      return;
    }

    const { error } = await supabase
      .from("exchange_requests")
      .insert({
        requester_id: user.id,
        receiver_id: searchResult.id,
        status: "pending",
      });

    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Richiesta di scambio inviata!"
    );

    setSearchResult(null);
    setUsername("");

    loadData();
  }

  async function acceptExchange(id: string) {
    const { error } = await supabase.rpc(
      "accept_barone_exchange",
      {
        p_request_id: id,
      }
    );

    if (error) {
      alert(
        "Scambio non completato: " +
          error.message
      );
      return;
    }

  alert(
  "🤝 TREGUA COMPLETATA!\n\n" +
  "Hai ottenuto Barone!\n\n" +
  "+9 punti per te\n" +
  "+9 punti alla tua Contrada"
);

    loadData();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-xl">
          Caricamento...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black">
            Devi accedere
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block bg-[#D4AF37] px-6 py-3 rounded-xl font-bold"
          >
            Accedi
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] pb-20">

      {/* HERO */}

      <section className="bg-[#5C3A21] text-white">
        <div className="max-w-6xl mx-auto px-5 py-12 text-center">

          <p className="uppercase tracking-[0.25em] text-amber-300 font-bold">
            Off Season 2026 · Parte 2
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-3">
            🤝 TREGUA
          </h1>

          <h2 className="text-2xl md:text-4xl font-black mt-2">
            TRA CONTRADE
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-amber-100">
            Colleziona tutti e 9 i Beniamini
            per ottenere <b>9 punti tu</b> e
            <b> 9 punti alla tua Contrada!</b>
          </p>

        </div>
      </section>


      <section className="max-w-6xl mx-auto px-5 py-10">

        {/* PROGRESSO */}

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">
                La tua collezione
              </p>

              <h2 className="text-3xl font-black text-[#5C3A21]">
                {owned.length}/9 Beniamini
              </h2>
            </div>

            <div className="text-4xl">
              {completed ? "🏆" : "🫏"}
            </div>

          </div>


          <div className="mt-5 h-4 rounded-full bg-gray-200 overflow-hidden">

            <div
              className="h-full bg-[#D4AF37] transition-all"
              style={{
                width: `${Math.min(
                  (owned.length / 9) * 100,
                  100
                )}%`,
              }}
            />

          </div>

        </div>


        {/* COLLEZIONE */}

        <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">

          {BENIAMINI.map((beniamino) => {

            const obtained =
              owned.includes(beniamino.id);

            return (
              <div
                key={beniamino.id}
                className={`
                  rounded-3xl p-3 text-center
                  bg-white shadow-lg
                  ${
                    obtained
                      ? "ring-2 ring-[#D4AF37]"
                      : "opacity-50 grayscale"
                  }
                `}
              >

                <div className="aspect-square relative">

                  <Image
                    src={beniamino.image}
                    alt={beniamino.nome}
                    fill
                    className="object-contain"
                  />

                  {!obtained && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-black text-black/40">
                        ?
                      </span>
                    </div>
                  )}

                </div>

                <p className="font-black text-sm mt-2">
                  {beniamino.nome}
                </p>

                <p className="text-xs text-gray-500">
                  {obtained
                    ? "Ottenuto"
                    : beniamino.tipo === "scambio"
                    ? "Scambio"
                    : "Mappa"}
                </p>

              </div>
            );
          })}

        </div>


        {/* SCAMBIO */}

        {hasAllEight && !hasBarone && (

          <section className="mt-10 bg-white rounded-3xl shadow-xl p-6 md:p-8">

            <div className="text-center">

              <div className="text-5xl">
                🤝
              </div>

              <h2 className="text-3xl font-black text-[#5C3A21] mt-3">
                È il momento della Tregua
              </h2>

              <p className="mt-3 text-gray-600">
                Hai trovato tutti gli 8 Beniamini.
                Ora trova un contradaiolo di un'altra
                Contrada e fai lo scambio.
              </p>

            </div>


            {/* CERCA UTENTE */}

            <div className="max-w-xl mx-auto mt-7">

              <label className="font-bold">
                Username del contradaiolo
              </label>

              <div className="flex gap-2 mt-2">

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchUser();
                    }
                  }}
                  placeholder="es. fantamiccio"
                  className="flex-1 rounded-xl border p-3"
                />

                <button
                  onClick={searchUser}
                  disabled={searching}
                  className="rounded-xl bg-[#5C3A21] text-white px-5 font-bold"
                >
                  {searching
                    ? "..."
                    : "Cerca"}
                </button>

              </div>


              {/* RISULTATO */}

              {searchResult && (

                <div className="mt-5 rounded-2xl bg-[#F8F5F0] p-5">

                  {searchResult.error ? (

                    <p className="text-red-600 font-bold">
                      {searchResult.error}
                    </p>

                  ) : (

                    <>

                      <p className="text-xl font-black">
                        @{searchResult.username}
                      </p>

                      <p className="text-gray-600">
                        Contrada:{" "}
                        {CONTRADE[
                          String(
                            searchResult.contrada_id
                          )
                        ] ??
                          searchResult.contrada_id}
                      </p>


                      <button
                        onClick={sendExchange}
                        disabled={sending}
                        className="mt-4 w-full rounded-xl bg-[#D4AF37] py-3 font-black text-[#5C3A21]"
                      >
                        {sending
                          ? "Invio..."
                          : "🤝 PROPONI SCAMBIO"}
                      </button>

                    </>

                  )}

                </div>

              )}

            </div>

          </section>
        )}


        {/* RICHIESTE RICEVUTE */}

        {incoming.length > 0 && (

          <section className="mt-8 bg-white rounded-3xl shadow-xl p-6">

            <h2 className="text-2xl font-black text-[#5C3A21]">
              Richieste di Tregua
            </h2>

            <div className="mt-5 space-y-4">

              {incoming.map((request) => (

                <div
                  key={request.id}
                  className="rounded-2xl bg-[#F8F5F0] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >

                  <div>

                    <p className="font-black text-lg">
                      🤝 @{request.requester?.username}
                    </p>

                    <p className="text-gray-600">
                      Vuole fare una Tregua con te.
                    </p>

                  </div>


                  <button
                    onClick={() =>
                      acceptExchange(request.id)
                    }
                    className="rounded-xl bg-[#D4AF37] px-6 py-3 font-black text-[#5C3A21]"
                  >
                    ACCETTA E OTTIENI BARONE
                  </button>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* COMPLETATO */}

        {completed && (

          <section className="mt-10 rounded-3xl bg-[#5C3A21] text-white p-8 text-center">

            <div className="text-6xl">
              👑
            </div>

            <h2 className="text-4xl font-black mt-3">
              TREGUA COMPLETATA!
            </h2>

            <p className="text-xl text-amber-200 mt-3">
              Hai collezionato tutti i 9 Beniamini.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">
                  +9
                </p>
                <p>
                  punti per te
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">
                  +9
                </p>
                <p>
                  punti alla tua Contrada
                </p>
              </div>

            </div>

          </section>

        )}

      </section>

    </main>
  );
}
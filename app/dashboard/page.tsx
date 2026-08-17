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

type UserProfile = {
  id: string;
  username: string;
  contrada_id: string | number | null;
};

type RankingUser = {
  username: string;
  contrada_id: string;
  punti: number;
};

type ContradaRanking = {
  id: string;
  nome: string;
  punti: number;
  iscritti: number;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [generalPoints, setGeneralPoints] = useState(0);
  const [generalPosition, setGeneralPosition] = useState(0);

  const [contradaPoints, setContradaPoints] = useState(0);
  const [contradaPosition, setContradaPosition] = useState(0);

  const [popularityMembers, setPopularityMembers] = useState(0);
  const [popularityPosition, setPopularityPosition] = useState(0);

  const [eightContradePoints, setEightContradePoints] = useState(0);
  const [eightContradePosition, setEightContradePosition] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      try {
        /* =========================
           UTENTE LOGGATO
        ========================= */

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        /* =========================
           PROFILO
        ========================= */

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, username, contrada_id")
            .eq("id", user.id)
            .single();

        if (profileError) {
          console.error("Errore profilo:", profileError);
          setLoading(false);
          return;
        }

        const currentProfile: UserProfile = {
          id: profileData.id,
          username: profileData.username,
          contrada_id:
            profileData.contrada_id !== null
              ? String(profileData.contrada_id)
              : null,
        };

        setProfile(currentProfile);

        const currentContradaId = currentProfile.contrada_id;


        /* =========================
   EVENT POINTS
========================= */

const { data: eventPoints, error: eventPointsError } =
  await supabase
    .from("event_points")
    .select(`
      user_id,
      points,
      contrada_id,
      profiles (
        username,
        contrada_id
      )
    `);

if (eventPointsError) {
  console.error("Errore event_points:", eventPointsError);
  setLoading(false);
  return;
}
        


        /* =========================
           CLASSIFICA GENERALE UTENTI
        ========================= */

        const users: Record<string, RankingUser> = {};

        eventPoints?.forEach((point: any) => {
  const profileData = Array.isArray(point.profiles)
    ? point.profiles[0]
    : point.profiles;

  if (!profileData?.username) return;

  const userId = String(point.user_id);

  if (!users[userId]) {
    users[userId] = {
      username: profileData.username,
      contrada_id: String(profileData.contrada_id ?? ""),
      punti: 0,
    };
  }

  users[userId].punti += Number(point.points) || 0;
});
       

        const generalRanking = Object.values(users).sort(
          (a, b) => b.punti - a.punti
        );

        const currentUserRankingIndex = generalRanking.findIndex(
          (user) => user.username === currentProfile.username
        );

        const currentUserRanking =
          generalRanking[currentUserRankingIndex];

        setGeneralPoints(currentUserRanking?.punti ?? 0);

        if (currentUserRankingIndex !== -1) {
          setGeneralPosition(currentUserRankingIndex + 1);
        }


        /* =========================
           CLASSIFICA SINGOLA CONTRADA
        ========================= */

        if (currentContradaId) {
          const contradaUsers = generalRanking
            .filter(
              (user) =>
                user.contrada_id === currentContradaId
            )
            .sort((a, b) => b.punti - a.punti);

          const userContradaIndex = contradaUsers.findIndex(
            (user) => user.username === currentProfile.username
          );

          setContradaPoints(
            contradaUsers[userContradaIndex]?.punti ?? 0
          );

          if (userContradaIndex !== -1) {
            setContradaPosition(userContradaIndex + 1);
          }
        }


        /* =========================
           PROFILI PER POPOLARITÀ
        ========================= */

        const { data: profiles, error: profilesError } =
          await supabase
            .from("profiles")
            .select("id, contrada_id");

        if (profilesError) {
          console.error("Errore profiles:", profilesError);
        }

        const contradaMembers: Record<string, number> = {};

        Object.keys(nomiContrade).forEach((id) => {
          contradaMembers[id] = 0;
        });

        profiles?.forEach((profile: any) => {
          if (!profile.contrada_id) return;

          const id = String(profile.contrada_id);

          if (contradaMembers[id] !== undefined) {
            contradaMembers[id]++;
          }
        });

        if (currentContradaId) {
          setPopularityMembers(
            contradaMembers[currentContradaId] ?? 0
          );
        }


        /* =========================
           PUNTI DELLE 8 CONTRADE
        ========================= */

        const contrade: Record<string, ContradaRanking> = {};

        Object.keys(nomiContrade).forEach((id) => {
          contrade[id] = {
            id,
            nome: nomiContrade[id],
            punti: 0,
            iscritti: contradaMembers[id] ?? 0,
          };
        });

        eventPoints?.forEach((point: any) => {
  if (!point?.contrada_id) return;

  const id = String(point.contrada_id);

  if (!contrade[id]) return;

  contrade[id].punti += Number(point.points) || 0;
});
        

        const contradeRanking = Object.values(contrade).sort(
          (a, b) => b.punti - a.punti
        );


        /* =========================
           POSIZIONE POPOLARITÀ
        ========================= */

        const popularityRanking = Object.values(contrade)
          .sort((a, b) => b.iscritti - a.iscritti);

        if (currentContradaId) {
          const popularityIndex = popularityRanking.findIndex(
            (contrada) => contrada.id === currentContradaId
          );

          if (popularityIndex !== -1) {
            setPopularityPosition(popularityIndex + 1);
          }
        }


        /* =========================
           POSIZIONE 8 CONTRADE
        ========================= */

        if (currentContradaId) {
          const eightContradeIndex = contradeRanking.findIndex(
            (contrada) => contrada.id === currentContradaId
          );

          const currentContrada =
            contradeRanking[eightContradeIndex];

          setEightContradePoints(
            currentContrada?.punti ?? 0
          );

          if (eightContradeIndex !== -1) {
            setEightContradePosition(
              eightContradeIndex + 1
            );
          }
        }

      } catch (error) {
        console.error("Errore dashboard:", error);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);


  const contradaId = profile?.contrada_id
    ? String(profile.contrada_id)
    : null;

  const stemma = contradaId
    ? stemmiContrade[contradaId]
    : null;

  const nomeContrada = contradaId
    ? nomiContrade[contradaId]
    : null;


  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* =========================
          HERO
      ========================= */}

      <section className="bg-gradient-to-r from-[#5C3A21] via-[#7A4A25] to-[#D4AF37] text-white">

        <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-14">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* STEMMA */}

            {stemma && (

              <div className="bg-white/95 rounded-2xl p-3 w-fit shadow-lg">

                <Image
                  src={stemma}
                  alt={`Stemma ${nomeContrada ?? ""}`}
                  width={80}
                  height={80}
                  className="object-contain"
                />

              </div>

            )}


            <div>

              <p className="text-amber-200 font-bold uppercase tracking-widest text-sm">
                FantaMiccio
              </p>

              <h1 className="text-3xl md:text-5xl font-black mt-1">
                Benvenuto/a {profile?.username ? "," : ""}
                {profile?.username
                  ? ` ${profile.username}`
                  : ""}
                !
              </h1>

              {nomeContrada && (

                <p className="text-amber-100 mt-2 text-base md:text-lg font-semibold">
                  Contrada del cuore: {nomeContrada}
                </p>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          STATISTICHE
      ========================= */}

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">


          {/* 1 GENERALE SINGOLO */}

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  Statistica Contradaiolo
                </p>

                <h2 className="text-xl md:text-2xl font-black text-[#5C3A21] mt-1">
                   Classifica Generale
                </h2>

              </div>

              <div className="text-3xl">
                🏆
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Punti totali
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading ? "..." : generalPoints}
                </p>

              </div>

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Posizione
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading
                    ? "..."
                    : generalPosition
                    ? `#${generalPosition}`
                    : "—"}
                </p>

              </div>

            </div>

          </div>


          {/* 2 SINGOLA CONTRADA */}

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  Statistica Contradaiolo
                </p>

                <h2 className="text-xl md:text-2xl font-black text-[#5C3A21] mt-1">
                   Classifica interna della mia Contrada
                </h2>

              </div>

              <div className="text-3xl">
                🚩
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Punti totali
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading ? "..." : contradaPoints}
                </p>

              </div>

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Posizione
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading
                    ? "..."
                    : contradaPosition
                    ? `#${contradaPosition}`
                    : "—"}
                </p>

              </div>

            </div>

          </div>


          {/* 3 POPOLARITÀ */}

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  Statistica Contrada
                </p>

                <h2 className="text-xl md:text-2xl font-black text-[#5C3A21] mt-1">
                   Popolarità
                </h2>

              </div>

              <div className="text-3xl">
                ⭐
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Iscritti
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading ? "..." : popularityMembers}
                </p>

              </div>

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Posizione
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading
                    ? "..."
                    : popularityPosition
                    ? `#${popularityPosition}`
                    : "—"}
                </p>

              </div>

            </div>

          </div>


          {/* 4 8 CONTRADE */}

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  Statistica Contrada
                </p>

                <h2 className="text-xl md:text-2xl font-black text-[#5C3A21] mt-1">
                   Classifica delle 8 Contrade
                </h2>

              </div>

              <div className="text-3xl">
                🏰
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Punti
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading ? "..." : eightContradePoints}
                </p>

              </div>

              <div className="rounded-2xl bg-[#F8F5F0] p-4">

                <p className="text-sm text-gray-500">
                  Posizione
                </p>

                <p className="text-2xl font-black text-[#5C3A21] mt-1">
                  {loading
                    ? "..."
                    : eightContradePosition
                    ? `#${eightContradePosition}`
                    : "—"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            VITA DI CONTRADA
        ========================= */}

        <div className="mt-8">

          <Link
            href="/dashboard/vita-da-contrada"
            className="flex items-center justify-center w-full rounded-2xl bg-[#5C3A21] text-white px-6 py-4 font-black text-lg shadow-lg hover:bg-[#7A4A25] transition"
          >
            Entra in Vita di Contrada →
          </Link>

        </div>

      </section>

    </main>
  );
}
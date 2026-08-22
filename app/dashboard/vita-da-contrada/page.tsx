"use client";
import ViewportDesktop from "../ViewportDesktop";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Event = {
  id: number | null;
  title: string;
  description: string;
  date: string | null;
  location: string | null;
  category: string | null;
};

// ============================================
// DATI (temporaneamente statici)
// TODO: Sostituire questi dati con quelli recuperati da Supabase
// ============================================

const nextEvent: Event = {
  id: null,
  title: "Calendario 2027",
  description: "Prossimamente disponibile",
  date: null,
  location: null,
  category: null,
};

const events: Event[] = [];

// TODO: Collegare il countdown al prossimo evento da Supabase.
// TODO: Recuperare gli eventi da Supabase.
// TODO: Aggiungere news della community.
// TODO: Aggiungere classifiche dinamiche.

export default function VitaDiContrada() {
  const [contradaId, setContradaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // RECUPERO CONTRADA UTENTE
  // ============================================

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("contrada_id")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Errore profilo:", error);
          setLoading(false);
          return;
        }

        setContradaId(
          profileData?.contrada_id !== null
            ? String(profileData.contrada_id)
            : null
        );
      } catch (error) {
        console.error("Errore:", error);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  // ============================================
  // SFONDI DELLE 8 CONTRADE
  // ============================================

  const sfondiContrade: Record<string, string> = {
    "1": "/contrade/bgv/cervia-bgv.png",
    "2": "/contrade/bgv/leondoro-bgv.png",
    "3": "/contrade/bgv/lucertola-bgv.png",
    "4": "/contrade/bgv/madonnina-bgv.jpg",
    "5": "/contrade/bgv/ponte-bgv.png",
    "6": "/contrade/bgv/pozzo-bgv.png",
    "7": "/contrade/bgv/quercia-bgv.png",
    "8": "/contrade/bgv/ranocchio-bgv.png",
  };

  const sfondo = contradaId
    ? sfondiContrade[contradaId]
    : null;

    const testoEventoBianco =
  contradaId === "2" ||
  contradaId === "3" ||
  contradaId === "4" ||
  contradaId === "5";

  return (
    <>
    <ViewportDesktop />
    <main
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: sfondo
          ? `url(${sfondo})`
          : "none",
        backgroundColor: "#F8F5F0",
      }}
    >
      {/* HERO */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-5xl font-black">
                🎭 Vita di Contrada
              </h1>

              <p className="mt-3 text-xl text-red-100">
                Il cuore della community di FantaMiccio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU RAPIDO */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "🫏",
              title: "Eventi",
              href: "/eventi",
            },
            {
              icon: "📅",
              title: "Calendario",
              href: "/calendario",
            },
            {
              icon: "🏆",
              title: "Classifiche",
              href: "/classifiche",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition"
            >
              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-4 font-bold text-xl">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* EVENTO IN CORSO */}
{/* EVENTO IN CORSO */}
<section className="max-w-7xl mx-auto px-6 mt-40 pb-20">
  <div
    className={`text-center font-black ${
      testoEventoBianco
        ? "text-white drop-shadow-lg"
        : "text-black drop-shadow-md"
    }`}
  >

    <h2 className="text-5xl md:text-6xl font-black">
      ⌛ Evento in corso
    </h2>

    <p className="text-4xl md:text-5xl font-black mt-6">
      Off Season 2026
    </p>

  </div>
</section>
    </main>
    </>
  );
}
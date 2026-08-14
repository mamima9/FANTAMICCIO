"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DashboardUser = {
  username: string;
  avatar?: string | null;
  contrada: {
    nome: string;
    logo: string;
  };
};

const stemmiContrade: Record<string, string> = {
  "La Cervia": "/account/cervia.png",
  "Cervia": "/account/cervia.png",

  "Leon d'Oro": "/account/leondoro.png",

  "La Lucertola": "/account/lucertola.jpg",
  "Lucertola": "/account/lucertola.jpg",

  "La Madonnina": "/account/madonnina.jpg",
  "Madonnina": "/account/madonnina.jpg",

  "Il Ponte": "/account/ponte.jpg",
  "Ponte": "/account/ponte.jpg",

  "Il Pozzo": "/account/pozzo.png",
  "Pozzo": "/account/pozzo.png",

  "La Quercia": "/account/quercia.png",
  "Quercia": "/account/quercia.png",

  "Il Ranocchio": "/account/ranocchi.png",
  "Ranocchio": "/account/ranocchi.png",
};

type Props = {
  user: DashboardUser;
};

export default function DashboardNavbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  // Se la contrada non viene riconosciuta → Cervia
  const stemmaContrada =
    stemmiContrade[user.contrada?.nome] || "/account/cervia.png";

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4AF37] bg-[#5C3A21] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* LOGO FANTAMICCIO */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/contrade/logo.png"
              alt="FantaMiccio"
              width={42}
              height={42}
              className="rounded-full"
            />

            <span className="text-xl font-bold text-[#D4AF37]">
              FantaMiccio
            </span>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="transition hover:text-[#D4AF37]"
            >
              Sede
            </Link>

            <Link
              href="/dashboard/vita-da-contrada"
              className="transition hover:text-[#D4AF37]"
            >
              Vita di Contrada
            </Link>
          </nav>
        </div>

        {/* MENU UTENTE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/10"
          >

            {/* PERSONAGGIO ACCOUNT */}
            <Image
              src={stemmaContrada}
              alt="Personaggio account"
              width={34}
              height={34}
              className="rounded-full border border-white"
            />

            <span className="hidden font-medium sm:block">
              {user.username}
            </span>

            <svg
              className={`h-4 w-4 transition ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 9L12 15L18 9" />
            </svg>
          </button>

          {/* TENDINA */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#D4AF37] bg-white text-gray-800 shadow-xl">

              <div className="border-b px-4 py-3">
                <p className="font-semibold">
                  {user.username}
                </p>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-3 transition hover:bg-gray-100"
              >
                🏠 Torna alla Home iniziale
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
              >
                Esci
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MENU MOBILE */}
      <nav className="border-t border-white/10 md:hidden">
        <div className="flex justify-around py-3">

          <Link href="/dashboard">
            Sede
          </Link>

          <Link href="/dashboard/vita-da-contrada">
            Vita di Contrada
          </Link>

        </div>
      </nav>
    </header>
  );
}
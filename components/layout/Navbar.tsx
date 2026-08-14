"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/palio-dei-micci", label: "Il Palio" },
  { href: "/contrade", label: "Contrade" },
  { href: "/albi-doro", label: "Albi d'Oro" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header
  className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#5C3A21]/95 backdrop-blur-xl shadow-xl border-b border-[#D4AF37]/20"
          : "bg-[#5C3A21]/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-4 transition hover:opacity-90"
        >
          <Image
            src="/contrade/logo.png"
            alt="FantaMiccio"
            width={56}
            height={56}
            priority
          />

          <div className="hidden sm:block">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#D4AF37]">
              FantaMiccio
            </h1>

            <p className="text-xs text-amber-100/80">
              Il Fantasy del Palio dei Micci
            </p>
          </div>
        </Link>

        {/* MENU DESKTOP */}

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-5 py-3 font-semibold transition-all duration-300 ${
                  active
                    ? "text-[#D4AF37]"
                    : "text-white hover:text-[#FFD96A]"
                }`}
              >
                {link.label}

                <span
                  className={`absolute bottom-1 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#D4AF37] transition-all duration-300 ${
                    active ? "w-8" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* PULSANTE DESKTOP */}

        {user ? (
          <Link
            href="/dashboard"
            className="hidden rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#5C3A21] transition hover:scale-105 hover:bg-[#E4BC43] lg:block"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="hidden rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#5C3A21] transition hover:scale-105 hover:bg-[#E4BC43] lg:block"
          >
            Accedi
          </Link>
        )}
      </div>

      {/* MENU MOBILE */}

      <div className="border-t border-[#D4AF37]/20 bg-[#5C3A21] lg:hidden">
        <nav className="grid grid-cols-2 gap-2 p-4">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-center font-semibold transition ${
                  active
                    ? "bg-[#D4AF37] text-[#5C3A21]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <Link
              href="/dashboard"
              className="col-span-2 mt-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-center font-bold text-[#5C3A21] transition hover:bg-[#E4BC43]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="col-span-2 mt-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-center font-bold text-[#5C3A21] transition hover:bg-[#E4BC43]"
            >
              Accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
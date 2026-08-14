"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Hero() {
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

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
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">

        <Image
          src="/contrade/logo.png"
          alt="FantaMiccio"
          width={220}
          height={220}
          priority
        />

        <h1 className="mt-8 text-6xl font-extrabold text-[#5C3A21]">
          FantaMiccio
        </h1>

        <p className="mt-4 max-w-2xl text-2xl text-gray-700">
          Il Fantasy Game del Palio dei Micci
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link
            href={user ? "/dashboard" : "/registrazione"}
            className="rounded-2xl bg-[#D4AF37] px-8 py-4 text-lg font-bold text-[#5C3A21] transition hover:scale-105"
          >
            Gioca Ora
          </Link>

        </div>

      </div>
    </section>
  );
}
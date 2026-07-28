"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">
        <section className="max-w-md mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-amber-900">
              Bentornato!
            </h1>

            <p className="mt-4 text-lg text-gray-700">
              Accedi al tuo account FantaMiccio e continua la tua avventura.
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="nome@email.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="mt-4 text-right">
              <Link
                href="#"
                className="text-sm text-amber-700 hover:underline"
              >
                Password dimenticata?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              className="mt-8 w-full rounded-2xl bg-[#D4AF37] py-4 text-xl font-bold text-[#5C3A21] transition hover:scale-[1.02]"
            >
              Accedi
            </button>

            <div className="mt-8 border-t pt-6 text-center">
              <p className="text-gray-600">
                Non hai ancora un account?
              </p>

              <Link
                href="/registrazione"
                className="mt-3 inline-block font-bold text-amber-700 hover:underline"
              >
                Registrati gratuitamente
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
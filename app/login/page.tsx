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

  // PASSWORD DIMENTICATA
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Inserisci email e password.");
      return;
    }

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

  const handleForgotPassword = async () => {
    setForgotMessage("");
    setForgotError("");

    const emailToReset = forgotEmail.trim();

    if (!emailToReset) {
      setForgotError("Inserisci la tua email.");
      return;
    }

    setForgotLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      emailToReset,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setForgotError(error.message);
    } else {
      setForgotMessage(
        "Ti abbiamo inviato un link per reimpostare la password. Controlla la tua email."
      );
    }

    setForgotLoading(false);
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

              {/* EMAIL */}
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

              {/* PASSWORD */}
              <div>
                <label className="block font-semibold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* PASSWORD DIMENTICATA */}
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotMessage("");
                  setForgotError("");
                  setShowForgotPassword(true);
                }}
                className="text-sm text-amber-700 hover:underline"
              >
                Password dimenticata?
              </button>
            </div>

            {/* LOGIN */}
            <button
              onClick={handleLogin}
              className="mt-8 w-full rounded-2xl bg-[#D4AF37] py-4 text-xl font-bold text-[#5C3A21] transition hover:scale-[1.02]"
            >
              Accedi
            </button>

            {/* REGISTRAZIONE */}
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

      {/* ================================================== */}
      {/* MODALE PASSWORD DIMENTICATA */}
      {/* ================================================== */}

      {showForgotPassword && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* TITOLO */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-[#5C3A21]">
                Password dimenticata?
              </h2>

              <p className="mt-3 text-gray-600">
                Inserisci l&apos;email del tuo account e ti invieremo un link
                per creare una nuova password.
              </p>
            </div>

            {/* EMAIL */}
            <div className="mt-6">
              <label className="mb-2 block font-semibold text-[#5C3A21]">
                Email
              </label>

              <input
                type="email"
                placeholder="nome@email.it"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* SUCCESSO */}
            {forgotMessage && (
              <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                {forgotMessage}
              </div>
            )}

            {/* ERRORE */}
            {forgotError && (
              <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {forgotError}
              </div>
            )}

            {/* INVIA */}
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className="mt-6 w-full rounded-2xl bg-[#D4AF37] py-4 font-bold text-[#5C3A21] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {forgotLoading
                ? "Invio in corso..."
                : "Invia link di recupero"}
            </button>

            {/* CHIUDI */}
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="mt-3 w-full rounded-2xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Annulla
            </button>

          </div>
        </div>
      )}
    </>
  );
}
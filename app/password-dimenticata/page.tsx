"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PasswordDimenticataPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("Non è stato possibile inviare l'email di recupero.");
    } else {
      setMessage(
        "Controlla la tua email: ti abbiamo inviato il link per reimpostare la password."
      );
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 px-6 py-16">
      <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <h1 className="text-3xl font-extrabold text-[#5C3A21]">
          Password dimenticata
        </h1>

        <p className="mt-3 text-gray-600">
          Inserisci l&apos;email associata al tuo account FantaMiccio.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-semibold text-[#5C3A21]">
              Email
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.it"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-[#D4AF37]"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#D4AF37] py-3 font-bold text-[#5C3A21] transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Invio in corso..." : "Invia link di recupero"}
          </button>

        </form>

        <Link
          href="/login"
          className="mt-6 block text-center font-semibold text-amber-700 hover:underline"
        >
          Torna al login
        </Link>

      </section>
    </main>
  );
}
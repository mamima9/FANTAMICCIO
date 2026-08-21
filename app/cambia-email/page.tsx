"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CambiaEmailPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const nuovaEmail = email.trim();

    if (!nuovaEmail) {
      setError("Inserisci una nuova email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      email: nuovaEmail,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Richiesta inviata! Controlla la nuova email e conferma il cambio di indirizzo."
      );

      setEmail("");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-stone-100 px-4 py-10">
      <section className="mx-auto max-w-xl">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          {/* TITOLO */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#5C3A21]">
              Cambia email
            </h1>

            <p className="mt-2 text-gray-600">
              Inserisci il nuovo indirizzo email associato al tuo account
              FantaMiccio.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-[#5C3A21]"
              >
                Nuova email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nuova@email.it"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* INFORMAZIONE */}
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Dopo la richiesta, riceverai un&apos;email di conferma al nuovo
              indirizzo.
            </div>

            {/* SUCCESSO */}
            {message && (
              <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {/* ERRORE */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* PULSANTE */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#D4AF37] py-4 font-bold text-[#5C3A21] transition hover:scale-[1.01] hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Salvataggio..." : "Cambia email"}
            </button>

          </form>

        </div>

      </section>
    </main>
  );
}
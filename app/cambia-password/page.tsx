"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CambiaPasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    // Controllo lunghezza password
    if (password.length < 6) {
      setError("La password deve contenere almeno 6 caratteri.");
      return;
    }

    // Controllo conferma password
    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);

    // Aggiorna la password tramite Supabase
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password cambiata con successo!");

      setPassword("");
      setConfirmPassword("");
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
              Cambia password
            </h1>

            <p className="mt-2 text-gray-600">
              Inserisci una nuova password per il tuo account FantaMiccio.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NUOVA PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-[#5C3A21]"
              >
                Nuova password
              </label>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la nuova password"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />

              <p className="mt-2 text-sm text-gray-500">
                La password deve contenere almeno 6 caratteri.
              </p>

            </div>

            {/* CONFERMA PASSWORD */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block font-semibold text-[#5C3A21]"
              >
                Conferma nuova password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ripeti la nuova password"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />

            </div>

            {/* MESSAGGIO SUCCESSO */}
            {message && (
              <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {/* MESSAGGIO ERRORE */}
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
              {loading ? "Salvataggio..." : "Cambia password"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}
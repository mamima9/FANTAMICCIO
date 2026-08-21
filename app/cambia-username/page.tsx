"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CambiaUsernamePage() {
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const nuovoUsername = username.trim();

    // Controllo lunghezza
    if (nuovoUsername.length < 3) {
      setError("Lo username deve contenere almeno 3 caratteri.");
      return;
    }

    // Controllo lunghezza massima
    if (nuovoUsername.length > 20) {
      setError("Lo username può contenere massimo 20 caratteri.");
      return;
    }

    // Controllo caratteri consentiti
    if (!/^[a-zA-Z0-9_]+$/.test(nuovoUsername)) {
      setError(
        "Lo username può contenere solo lettere, numeri e underscore."
      );
      return;
    }

    setLoading(true);

    // Recupera l'utente autenticato
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Devi essere autenticato per cambiare username.");
      setLoading(false);
      return;
    }

    // Controlla se lo username è già utilizzato
    const { data: usernameEsistente, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", nuovoUsername)
      .neq("id", user.id)
      .maybeSingle();

    if (checkError) {
      setError("Si è verificato un errore. Riprova.");
      setLoading(false);
      return;
    }

    if (usernameEsistente) {
      setError("Questo username è già utilizzato.");
      setLoading(false);
      return;
    }

    // Aggiorna lo username
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: nuovoUsername,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Username cambiato con successo!");
      setUsername("");
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
              Cambia username
            </h1>

            <p className="mt-2 text-gray-600">
              Scegli il nuovo username con cui comparirai su FantaMiccio.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block font-semibold text-[#5C3A21]"
              >
                Nuovo username
              </label>

              <input
                id="username"
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nuovo username"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />

              <p className="mt-2 text-sm text-gray-500">
                3-20 caratteri. Sono consentiti lettere, numeri e underscore.
              </p>
            </div>

            {/* INFORMAZIONE */}
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Lo username deve essere unico: se è già utilizzato da un altro
              fantacontradaiolo, dovrai sceglierne un altro.
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
              {loading ? "Salvataggio..." : "Cambia username"}
            </button>

          </form>

        </div>

      </section>
    </main>
  );
}
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const supabase = createClient();

const contrade = [
  "Cervia",
  "Leon d'Oro",
  "Madonnina",
  "Ponte",
  "Ranocchio",
  "Lucertola",
  "Quercia",
  "Pozzo",
];

export default function RegistrazionePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contrada, setContrada] = useState("");

  const [termini, setTermini] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // ==================================================
    // CONTROLLI CAMPI OBBLIGATORI
    // ==================================================

    if (!nome.trim()) {
      alert("Inserisci il nome.");
      return;
    }

    if (!cognome.trim()) {
      alert("Inserisci il cognome.");
      return;
    }

    if (!username.trim()) {
      alert("Inserisci uno username.");
      return;
    }

    if (!email.trim()) {
      alert("Inserisci la tua email.");
      return;
    }

    if (!contrada) {
      alert("Seleziona la tua Contrada del cuore.");
      return;
    }

    if (!password) {
      alert("Inserisci una password.");
      return;
    }

    if (!confirmPassword) {
      alert("Conferma la password.");
      return;
    }

    // ==================================================
    // CONTROLLO USERNAME
    // ==================================================

    const usernamePulito = username.trim();

    if (usernamePulito.length < 3) {
      alert("Lo username deve contenere almeno 3 caratteri.");
      return;
    }

    if (usernamePulito.length > 20) {
      alert("Lo username può contenere massimo 20 caratteri.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernamePulito)) {
      alert(
        "Lo username può contenere solo lettere, numeri e underscore."
      );
      return;
    }

    // ==================================================
    // CONTROLLO PASSWORD
    // ==================================================

    if (password.length < 6) {
      alert("La password deve contenere almeno 6 caratteri.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }

    // ==================================================
    // CONTROLLO TERMINI E PRIVACY
    // ==================================================

    if (!termini) {
      alert("Devi accettare i Termini di Servizio.");
      return;
    }

    if (!privacy) {
      alert("Devi accettare la Privacy Policy.");
      return;
    }

    setLoading(true);

    // ==================================================
    // CONTROLLO USERNAME GIÀ ESISTENTE
    // ==================================================

    const { data: usernameEsistente, error: usernameError } =
      await supabase
        .from("profiles")
        .select("id")
        .eq("username", usernamePulito)
        .maybeSingle();

    if (usernameError) {
      setLoading(false);
      alert(
        "Errore durante il controllo dello username. Riprova."
      );
      return;
    }

    if (usernameEsistente) {
      setLoading(false);
      alert("Questo username è già utilizzato.");
      return;
    }

    // ==================================================
    // REGISTRAZIONE SUPABASE
    // ==================================================

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          nome: nome.trim(),
          cognome: cognome.trim(),
          username: usernamePulito,
          contrada,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("Errore durante la registrazione.");
      return;
    }

    // ==================================================
    // REGISTRAZIONE COMPLETATA
    // ==================================================

    alert(
      "Registrazione completata! Controlla la tua email per confermare l'account."
    );

    router.push("/login");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">

        <section className="mx-auto max-w-3xl px-6 py-16">

          {/* HEADER */}

          <div className="mb-12 text-center">

            <h1 className="text-5xl font-extrabold text-amber-900">
              Unisciti a FantaMiccio
            </h1>

            <p className="mt-5 text-lg text-gray-700">
              Crea gratuitamente il tuo account e vivi il Palio dei Micci
              tutto l&apos;anno.
            </p>

          </div>

          {/* CARD */}

          <div className="rounded-3xl bg-white p-8 shadow-2xl">

            <div className="grid gap-6 md:grid-cols-2">

              {/* NOME */}

              <div>
                <label
                  htmlFor="nome"
                  className="font-semibold"
                >
                  Nome *
                </label>

                <input
                  id="nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Mario"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />
              </div>

              {/* COGNOME */}

              <div>
                <label
                  htmlFor="cognome"
                  className="font-semibold"
                >
                  Cognome *
                </label>

                <input
                  id="cognome"
                  type="text"
                  required
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  placeholder="Rossi"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />
              </div>

              {/* USERNAME */}

              <div className="md:col-span-2">

                <label
                  htmlFor="username"
                  className="font-semibold"
                >
                  Username *
                </label>

                <input
                  id="username"
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Fantacontradaiolo"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />

                <p className="mt-2 text-sm text-gray-500">
                  3-20 caratteri. Sono consentiti lettere, numeri e
                  underscore.
                </p>

              </div>

              {/* EMAIL */}

              <div className="md:col-span-2">

                <label
                  htmlFor="email"
                  className="font-semibold"
                >
                  Email *
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.it"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="font-semibold"
                >
                  Password *
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />

              </div>

              {/* CONFERMA PASSWORD */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="font-semibold"
                >
                  Conferma Password *
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-amber-500"
                />

              </div>

              {/* CONTRADA */}

              <div className="md:col-span-2">

                <label
                  htmlFor="contrada"
                  className="font-semibold"
                >
                  Contrada del cuore *
                </label>

                <select
                  id="contrada"
                  required
                  value={contrada}
                  onChange={(e) => setContrada(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-amber-500"
                >

                  <option value="">
                    Seleziona una Contrada
                  </option>

                  {contrade.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* TERMINI E PRIVACY */}

            <div className="mt-8 space-y-4">

              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  checked={termini}
                  onChange={(e) => setTermini(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />

                <span>
                  Accetto i Termini di Servizio *
                </span>

              </label>

              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />

                <span>
                  Accetto la Privacy Policy *
                </span>

              </label>

            </div>

            {/* PULSANTE */}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="mt-10 w-full rounded-2xl bg-[#D4AF37] py-4 text-xl font-bold text-[#5C3A21] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Registrazione..."
                : "🚀 Crea il mio account"}
            </button>

            {/* LOGIN */}

            <p className="mt-8 text-center text-gray-600">
              Hai già un account?
            </p>

            <div className="mt-4 flex justify-center">

              <a
                href="/login"
                className="font-bold text-amber-700 hover:underline"
              >
                Accedi
              </a>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
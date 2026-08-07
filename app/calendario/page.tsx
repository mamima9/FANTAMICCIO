import Link from "next/link";

export default function CalendarioPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-black">
            📅 Calendario FantaMiccio 2027
          </h1>

          <p className="mt-5 text-xl text-red-100 max-w-3xl mx-auto">
            Il calendario ufficiale della stagione sarà pubblicato
            prima dell'inizio della prima manifestazione del 2027.
          </p>

          <p className="mt-3 text-lg text-red-200 max-w-3xl mx-auto">
            Qui troverai tutte le giornate, gli eventi e le principali
            scadenze della stagione.
          </p>

        </div>
      </section>

      {/* CONTENUTO */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-6xl">
            ⏳
          </div>

          <h2 className="text-3xl font-black text-[#5C3A21] mt-6">
            Calendario in preparazione
          </h2>

          <p className="mt-6 text-xl text-gray-600">
            Il calendario della stagione 2027 verrà pubblicato
            non appena saranno ufficializzate le date
            della prima manifestazione.
          </p>

          <p className="mt-4 text-gray-500">
            Tutte le informazioni saranno aggiornate automaticamente.
          </p>

        </div>

        {/* Pulsante */}

        <div className="flex justify-center mt-12">

          <Link
            href="/dashboard/vita-da-contrada"
            className="bg-[#D4AF37] text-[#5C3A21] px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
          >
            ← Torna a Vita di Contrada
          </Link>

        </div>

      </section>

    </main>
  );
}
import Link from "next/link";

export default function CalendarioPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-black">
            📅 Calendario FantaMiccio 
          </h1>

          <p className="mt-5 text-xl text-red-100 max-w-3xl mx-auto">
            Il calendario ufficiale della stagione sarà aggiornato
            prima dell'inizio della prima manifestazione del 2027.
          </p>

         

        </div>
      </section>

      {/* CONTENUTO */}

      <section className="max-w-5xl mx-auto px-6 py-16">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">


        <h2 className="mt-6 text-center text-3xl font-black text-[#5C3A21]">
  Agosto 2026 : OFF SEASON 2026
</h2>

<p className="mt-2 text-center text-lg text-[#5C3A21]/80">
   Ha ufficialmente inizio la Off Season 2026 di FantaMiccio.
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
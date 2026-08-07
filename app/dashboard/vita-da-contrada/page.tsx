import Link from "next/link";

type Event = {
  id: number | null;
  title: string;
  description: string;
  date: string | null;
  location: string | null;
  category: string | null;
};

// ============================================
// DATI (temporaneamente statici)
// TODO: Sostituire questi dati con quelli recuperati da Supabase
// ============================================

const nextEvent: Event = {
  id: null,
  title: "Calendario 2027",
  description: "Prossimamente disponibile",
  date: null,
  location: null,
  category: null,
};

const events: Event[] = [];

// TODO: Collegare il countdown al prossimo evento da Supabase.
// TODO: Recuperare gli eventi da Supabase.
// TODO: Aggiungere news della community.
// TODO: Aggiungere classifiche dinamiche.

export default function VitaDiContrada() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* HERO */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-5xl font-black">🎭 Vita di Contrada</h1>
              <p className="mt-3 text-xl text-red-100">
                Il cuore della community di FantaMiccio
              </p>
            </div>

            <Link
              href="/dashboard"
              className="bg-[#D4AF37] text-[#5C3A21] px-5 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
            >
              👤 Il mio Profilo
            </Link>
          </div>
        </div>
      </section>

      {/* MENU RAPIDO */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: "🏆", title: "Eventi", href: "/eventi" },
            { icon: "📅", title: "Calendario", href: "/calendario" },
            { icon: "🏆", title: "Classifiche", href: "/classifiche" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition"
            >
              <div className="text-5xl">{item.icon}</div>
              <h3 className="mt-4 font-bold text-xl">{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-6 mt-14 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#5C3A21] to-[#8B5E3C] text-white p-10 shadow-2xl text-center">
          <h2 className="text-4xl font-black">⏳ Prossimo Evento</h2>

          {nextEvent.date ? (
            <>
              <p className="text-6xl font-black mt-8">--</p>
              <p className="text-2xl">Giorni</p>
              <p className="mt-5 text-xl">{nextEvent.title}</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-black mt-8">
                {nextEvent.title}
              </p>
              <p className="mt-4 text-xl text-yellow-300">
                {nextEvent.description}
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
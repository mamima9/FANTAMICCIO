import Link from "next/link";

export default function VitaDiContrada() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div>
              <h1 className="text-5xl font-black">
                🎭 Vita di Contrada
              </h1>

              <p className="mt-3 text-xl text-red-100">
                Il cuore della community di FantaMiccio
              </p>
            </div>

            <div className="flex gap-3">

              <button className="bg-white text-red-700 px-5 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition">
                🔔 3 Notifiche
              </button>

              <Link
                href="/dashboard"
                className="bg-[#D4AF37] text-[#5C3A21] px-5 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
              >
                👤 Il mio Profilo
              </Link>

            </div>

          </div>

        </div>
      </section>



      {/* MENU RAPIDO */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

          {[
  {
    icon: "🏆",
    title: "Eventi",
    href: "/eventi",
  },
  {
    icon: "📅",
    title: "Calendario",
    href: "/calendario",
  },
  {
    icon: "🏅",
    title: "Classifiche",
    href: "/classifiche",
  },
  {
    icon: "📊",
    title: "Contrade",
    href: "/contrade",
  },
  {
    icon: "📜",
    title: "Regole",
    href: "/regolamento",
  },
].map((item) => (
  <Link
    key={item.title}
    href={item.href}
    className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition"
  >
    <div className="text-5xl">{item.icon}</div>

    <h3 className="mt-4 font-bold text-xl">
      {item.title}
    </h3>
  </Link>
))}

        </div>

      </section>



      {/* HIGHLIGHTS */}

      <section className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-black mb-8 text-[#5C3A21]">
          🏆 Protagonisti della Stagione
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="text-5xl">❤️</div>

            <h3 className="font-bold text-2xl mt-4">
              Contrada con più tifosi
            </h3>

            <p className="mt-4 text-4xl font-black text-red-600">
              Cervia
            </p>

            <p className="text-gray-500">
              487 tifosi
            </p>

          </div>



          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="text-5xl">🥇</div>

            <h3 className="font-bold text-2xl mt-4">
              Miglior Media Punti
            </h3>

            <p className="mt-4 text-4xl font-black text-red-600">
              Leon d'Oro
            </p>

            <p className="text-gray-500">
              1986 punti medi
            </p>

          </div>



          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="text-5xl">👑</div>

            <h3 className="font-bold text-2xl mt-4">
              Leader FantaMiccio
            </h3>

            <p className="mt-4 text-3xl font-black text-red-600">
              Manuel
            </p>

            <p className="mt-2">
              ❤️ Cervia
            </p>

            <p className="font-bold mt-2">
              2248 punti
            </p>

          </div>

        </div>

      </section>



      {/* COUNTDOWN */}

      <section className="max-w-7xl mx-auto px-6 mt-14">

        <div className="rounded-3xl bg-gradient-to-r from-[#5C3A21] to-[#8B5E3C] text-white p-10 shadow-2xl text-center">

          <h2 className="text-4xl font-black">
            ⏳ Prossimo Evento
          </h2>

          <p className="text-6xl font-black mt-8">
            04
          </p>

          <p className="text-2xl">
            Giorni
          </p>

          <p className="mt-5 text-xl">
            alla 3ª Giornata del Torneo
          </p>

        </div>

      </section>



      {/* CHIACCHIERICCIO */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black mb-10 text-[#5C3A21]">
          📰 Il Chiacchiericcio Popolano
        </h2>

        <div className="space-y-6">

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-bold text-red-600">
              📢 Aggiornamento FantaMiccio
            </h3>

            <p className="mt-2">
              È disponibile la formazione della 3ª giornata.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-bold text-red-600">
              🏇 News Palio
            </h3>

            <p className="mt-2">
              Pubblicato il calendario ufficiale degli eventi.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-bold text-red-600">
              💬 Comunità
            </h3>

            <p className="mt-2">
              La Cervia festeggia la vittoria nell'ultima giornata.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}
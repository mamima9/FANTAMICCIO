import Link from "next/link";

export default function EventiPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-black">
            🏆 Eventi FantaMiccio
          </h1>

          <p className="mt-4 text-xl text-red-100">
            Scegli un evento e partecipa alle sfide della stagione.
          </p>

        </div>
      </section>

      {/* EVENTI */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* CORSA DEL MICCIO */}

          <Link
            href="/eventi/corsa-del-miccio"
            className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 transition"
          >
            <div className="text-6xl text-center">
             🫏
 
            </div>

            <h2 className="text-2xl font-black mt-6 text-center">
              Corsa del Miccio
            </h2>

            <p className="mt-4 text-center text-gray-600">
              Fai il tuo pronostico sulla Corsa del Miccio e conquista punti.
            </p>

            <p className="mt-6 text-center font-bold text-red-700">
              Gioca →
            </p>
          </Link>

          {[
            ["👑", "Coppa del Presidente"],
            ["⚽", "Calcio"],
            ["🎭", "Tema"],
            ["🥁", "Trofeo Meccheri"],
            ["🎤", "Miccio Canterino"],
            ["🏃", "Staffetta"],
            ["🚩", "Bandiera"],
            ["⚔️", "Alabarda"],
            ["👗", "Corteo Storico"],
            ["💃", "Miss Palio"],
          ].map(([icon, title]) => (
            <div
              key={title}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-between"
            >
              <div>

                <div className="text-6xl text-center">
                  {icon}
                </div>

                <h2 className="text-2xl font-black mt-6 text-center">
                  {title}
                </h2>

                <p className="mt-4 text-center text-gray-600">
                  Questo evento sarà disponibile in una futura versione di FantaMiccio.
                </p>

              </div>

              <div className="mt-8 text-center">
                <span className="inline-block bg-amber-100 text-amber-800 font-bold px-5 py-2 rounded-full">
                  🚧 Prossimamente
                </span>
              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
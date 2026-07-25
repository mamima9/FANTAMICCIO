import Link from "next/link";

export default function ClassifichePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* HERO */}

      <section className="bg-gradient-to-r from-[#8B0000] via-red-700 to-[#D4AF37] text-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-between items-center flex-wrap gap-6">

            <div>
              <h1 className="text-5xl font-black">
                🏆 Classifiche
              </h1>

              <p className="mt-3 text-xl text-red-100">
                Scopri chi sta dominando la stagione.
              </p>
            </div>

            <Link
              href="/vita-di-contrada"
              className="bg-white text-red-700 font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              ← Vita di Contrada
            </Link>

          </div>

        </div>

      </section>



      {/* PODIO */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-black text-center text-[#5C3A21] mb-12">
          👑 Podio Generale
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl">🥈</div>

            <h3 className="mt-4 text-3xl font-black">
              Luca
            </h3>

            <p>💙 Leon d'Oro</p>

            <p className="mt-4 text-4xl font-black text-red-600">
              2.210
            </p>

          </div>

          <div className="bg-[#D4AF37] rounded-3xl shadow-2xl p-10 text-center scale-105">

            <div className="text-7xl">🥇</div>

            <h3 className="mt-4 text-4xl font-black">
              Manuel
            </h3>

            <p>❤️ Cervia</p>

            <p className="mt-4 text-5xl font-black">
              2.248
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

            <div className="text-6xl">🥉</div>

            <h3 className="mt-4 text-3xl font-black">
              Marco
            </h3>

            <p>💚 Madonnina</p>

            <p className="mt-4 text-4xl font-black text-red-600">
              2.192
            </p>

          </div>

        </div>

      </section>



      {/* CLASSIFICA */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#5C3A21] text-white p-6">

            <h2 className="text-3xl font-black">
              📋 Classifica Generale
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-5 text-left">#</th>
                <th className="p-5 text-left">Contradaiolo</th>
                <th className="p-5 text-left">Contrada</th>
                <th className="p-5 text-right">Punti</th>

              </tr>

            </thead>

            <tbody>

              {[
                ["1","Manuel","❤️ Cervia","2248"],
                ["2","Luca","💙 Leon d'Oro","2210"],
                ["3","Marco","💚 Madonnina","2192"],
                ["4","Andrea","💛 Il Ponte","2168"],
                ["5","Simone","🩵 Ranocchio","2150"],
                ["6","Davide","🧡 Pozzo","2133"],
                ["7","Matteo","💜 Lucertola","2120"],
                ["8","Filippo","🤍 Corte","2104"],
                ["9","Alessio","❤️ Cervia","2098"],
                ["10","Giacomo","💙 Leon d'Oro","2084"],
              ].map((riga)=>(
                <tr
                  key={riga[0]}
                  className="border-b hover:bg-amber-50 transition"
                >

                  <td className="p-5 font-bold">{riga[0]}</td>

                  <td className="p-5">{riga[1]}</td>

                  <td className="p-5">{riga[2]}</td>

                  <td className="p-5 text-right font-bold">
                    {riga[3]}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}
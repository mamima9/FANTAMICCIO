import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

const contrade = [
  { nome: "La Cervia", stemma: "/contrade/cervia.png" },
  { nome: "Leon d'Oro", stemma: "/contrade/leondoro.png" },
  { nome: "La Lucertola", stemma: "/contrade/lucertola.png" },
  { nome: "La Madonnina", stemma: "/contrade/madonnina.png" },
  { nome: "Il Ponte", stemma: "/contrade/ponte.png" },
  { nome: "Il Pozzo", stemma: "/contrade/pozzo.png" },
  { nome: "La Quercia", stemma: "/contrade/quercia.png" },
  { nome: "Il Ranocchio", stemma: "/contrade/ranocchio.png" },
];

export default function PalioDeiMicciPage() {
  return (
    <>
  <Navbar />

    <main className="bg-[#faf6ef] text-[#5C3A21]">

      {/* HERO */}

      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">


        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center text-white px-6">

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Il Palio dei Micci
          </h1>

          <p className="max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed">
            Tradizione, storia, passione e spettacolo dal 1956.
          </p>

          <Link
            href="/contrade"
            className="inline-block mt-10 bg-amber-600 hover:bg-amber-700 transition text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
          >
            Scopri le Contrade
          </Link>

        </div>

      </section>

      {/* INTRODUZIONE */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Cos'è il Palio dei Micci
          </h2>

          <div className="bg-white rounded-3xl shadow-lg p-10 leading-8 text-lg space-y-8">

            <p>
              Il <strong>Palio dei Micci</strong> è una manifestazione
              storico-folcloristica ideata nel <strong>1956</strong> e
              disputata ogni anno la <strong>prima domenica di maggio</strong>
              a Querceta.
            </p>

            <p>
              Il nome deriva dal termine versiliese <strong>"miccio"</strong>,
              che indica l'asino, protagonista della corsa finale che assegna
              l'ambito Gonfalone alla Contrada vincitrice.
            </p>

            <p>
              Nato inizialmente come evento turistico legato alla festa
              patronale di San Giuseppe, nel corso degli anni è diventato una
              delle manifestazioni storiche più importanti della Toscana e la
              principale rievocazione storico-popolare della Provincia di Lucca.
            </p>

            <p>
              Il Palio coinvolge ogni anno oltre duemila figuranti,
              centinaia di musici e sbandieratori e migliaia di spettatori
              provenienti da tutta Italia e anche dall'estero.
            </p>

            <p>
              Non rappresenta solamente una corsa tra asini, ma una festa
              popolare che unisce storia, tradizione, folklore,
              spettacolo e appartenenza alle otto Contrade di Querceta.
            </p>

          </div>

        </div>

      </section>

      {/* NUMERI */}

      <section className="py-20 bg-[#f3ead9]">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Il Palio in Numeri
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              ["'56", "Prima edizione"],
              ["8", "Contrade"],
              ["+2k", "Figuranti"],
              ["10k", "Spettatori ogni anno"],
              ["1a", "Domenica di Maggio"],
              ["LU", "Evento storico della Provincia"],
            ].map(([numero, titolo]) => (

              <div
                key={numero}
                className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
              >

                <div className="text-5xl font-bold text-amber-700 mb-4">
                  {numero}
                </div>

                <p className="font-semibold text-lg">
                  {titolo}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CONTRADE */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-5">
            Le Otto Contrade
          </h2>

          <p className="text-center text-lg max-w-3xl mx-auto mb-14">

            Da oltre sessant'anni le otto Contrade rappresentano il cuore
            pulsante del Palio dei Micci. Ognuna custodisce una propria
            identità, colori, simboli e tradizioni tramandate nel tempo.

          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {contrade.map((contrada) => (

              <div
                key={contrada.nome}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center"
              >

                <Image
                  src={contrada.stemma}
                  alt={contrada.nome}
                  width={110}
                  height={110}
                />

                <h3 className="mt-4 font-bold text-lg text-center">
                  {contrada.nome}
                </h3>

              </div>

            ))}

          </div>

          <div className="text-center mt-14">

            <Link
              href="/contrade"
              className="inline-block bg-[#5C3A21] hover:bg-[#734a2b] transition text-white px-8 py-4 rounded-xl font-semibold"
            >
              Scopri tutte le Contrade →
            </Link>

          </div>

        </div>

      </section>
            {/* COME SI SVOLGE IL PALIO */}

      <section className="py-20 bg-[#f3ead9]">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-5">
            Come si svolge il Palio
          </h2>

          <p className="text-center text-lg max-w-3xl mx-auto mb-16">
            Il Palio dei Micci è molto più di una corsa: è un'intera giornata di
            spettacolo che coinvolge migliaia di figuranti, musici,
            sbandieratori e volontari delle otto Contrade.
          </p>

          <div className="space-y-8">

            {[
              {
                numero: "1",
                titolo: "Preparazione",
                testo:
                  "Per mesi le Contrade preparano costumi, scenografie, carri, spettacoli e allenano musici e sbandieratori.",
              },
              {
                numero: "2",
                titolo: "Corteo Storico",
                testo:
                  "Oltre duemila figuranti sfilano per le vie di Querceta con abiti ispirati al Medioevo e al Rinascimento.",
              },
              {
                numero: "3",
                titolo: "Rappresentazioni",
                testo:
                  "Ogni Contrada mette in scena un tema originale con recitazione, scenografie e personaggi storici o leggendari.",
              },
              {
                numero: "4",
                titolo: "Musici e Sbandieratori",
                testo:
                  "Tamburi, chiarine e bandiere trasformano il campo del Palio in uno spettacolo ricco di ritmo, colori e tradizione.",
              },
              {
                numero: "5",
                titolo: "La Corsa dei Micci",
                testo:
                  "Il momento più atteso della giornata: gli otto micci si sfidano per conquistare il prestigioso Gonfalone.",
              },
            ].map((step) => (

              <div
                key={step.numero}
                className="bg-white rounded-2xl shadow-md p-8 flex gap-6 items-start hover:shadow-xl transition"
              >

                <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center text-3xl font-bold shrink-0">
                  {step.numero}
                </div>

                <div>

                  <h3 className="text-2xl font-bold mb-3">
                    {step.titolo}
                  </h3>

                  <p className="text-lg leading-8">
                    {step.testo}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* TRADIZIONE E LEGGENDA */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Tra Tradizione e Leggenda
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            <div className="bg-white rounded-3xl shadow-lg p-10">

              <h3 className="text-2xl font-bold mb-6">
                Una storia che continua dal 1956
              </h3>

              <p className="leading-8 text-lg mb-5">
                Il Palio dei Micci nasce come manifestazione popolare ispirata
                alle antiche rievocazioni medievali e rinascimentali della
                Toscana.
              </p>

              <p className="leading-8 text-lg">
                Negli anni è diventato un appuntamento imprescindibile della
                Versilia, mantenendo intatto lo spirito delle Contrade e la
                partecipazione di migliaia di volontari.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-10">

              <h3 className="text-2xl font-bold mb-6">
                Eriberto Bindo "Lo Stanco"
              </h3>

              <p className="leading-8 text-lg mb-5">
                Nei primi anni Sessanta lo scrittore e poeta Silvano
                Alessandrini inventò il personaggio di Eriberto Bindo detto
                "Lo Stanco".
              </p>

              <p className="leading-8 text-lg">
                La leggenda fu così credibile che per anni numerosi studiosi
                cercarono inutilmente documenti storici che dimostrassero la sua
                reale esistenza.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* LA PASSIONE DELLE CONTRADE */}

      <section className="py-20 bg-[#f3ead9]">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            La Passione delle Contrade
          </h2>

          <div className="bg-white rounded-3xl shadow-lg p-12">

            <p className="text-lg leading-9 mb-8">
              Per un contradaiolo il Palio non rappresenta solamente una gara.
              È un simbolo di appartenenza, amicizia e tradizione che si
              tramanda di generazione in generazione.
            </p>

            <p className="text-lg leading-9 mb-8">
              Ogni Contrada dedica migliaia di ore di lavoro volontario alla
              realizzazione dei costumi, delle scenografie, delle
              rappresentazioni e all'organizzazione delle numerose attività che
              accompagnano il Palio durante tutto l'anno.
            </p>

            <p className="text-lg leading-9 mb-8">
              Le rivalità storiche convivono con un forte spirito di comunità,
              rendendo questa manifestazione uno degli eventi popolari più
              sentiti dell'intera Versilia.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">

              <div className="bg-[#faf6ef] rounded-2xl p-8 text-center">

                <div className="text-5xl mb-3">
                  ❤️
                </div>

                <h3 className="font-bold text-xl mb-2">
                  Passione
                </h3>

                <p>
                  Un sentimento che unisce intere generazioni.
                </p>

              </div>

              <div className="bg-[#faf6ef] rounded-2xl p-8 text-center">

                <div className="text-5xl mb-3">
                  🛡️
                </div>

                <h3 className="font-bold text-xl mb-2">
                  Identità
                </h3>

                <p>
                  Ogni Contrada custodisce la propria storia e le proprie tradizioni.
                </p>

              </div>

              <div className="bg-[#faf6ef] rounded-2xl p-8 text-center">

                <div className="text-5xl mb-3">
                  🎉
                </div>

                <h3 className="font-bold text-xl mb-2">
                  Comunità
                </h3>

                <p>
                  Migliaia di persone rendono possibile il Palio ogni anno.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* RICONOSCIMENTO DI SANDRO PERTINI */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-gradient-to-r from-amber-100 to-yellow-50 rounded-3xl shadow-xl p-12">

            <h2 className="text-4xl font-bold text-center mb-10">
              Il Riconoscimento del Presidente Sandro Pertini
            </h2>

            <p className="text-lg leading-9 mb-6">
              Nel corso della sua storia, il Palio dei Micci ha ricevuto
              importanti attestati di stima dalle istituzioni italiane,
              diventando una delle manifestazioni folkloristiche più
              rappresentative della Toscana.
            </p>

            <p className="text-lg leading-9 mb-6">
              Tra i riconoscimenti più prestigiosi spicca quello conferito dal
              Presidente della Repubblica <strong>Sandro Pertini</strong>, che
              volle testimoniare il valore culturale, storico e sociale della
              manifestazione e del lavoro svolto dalle Contrade.
            </p>

            <p className="text-lg leading-9">
              Ancora oggi questo riconoscimento rappresenta motivo di grande
              orgoglio per tutta la comunità di Querceta e per le migliaia di
              volontari che mantengono viva questa tradizione.
            </p>

          </div>

        </div>

      </section>

      {/* TUTTE LE MANIFESTAZIONI */}

      <section className="py-20 bg-[#f3ead9]">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-5">
            Tutte le Manifestazioni del Palio
          </h2>

          <p className="text-center text-lg max-w-3xl mx-auto mb-14">
            Durante l'anno il Palio dei Micci non è soltanto la celebre corsa
            finale, ma un insieme di competizioni e manifestazioni che
            coinvolgono tutte le Contrade.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                emoji: "🐴",
                titolo: "Palio dei Micci",
                testo:
                  "La storica corsa tra gli asini che assegna il Gonfalone alla Contrada vincitrice.",
              },
              {
                emoji: "👑",
                titolo: "Corteo Storico",
                testo:
                  "Migliaia di figuranti sfilano con costumi ispirati al Medioevo e al Rinascimento.",
              },
              {
                emoji: "⚽",
                titolo: "Torneo di Calcio",
                testo:
                  "Le Contrade si affrontano durante l'estate in uno dei tornei più sentiti della Versilia.",
              },
              {
                emoji: "🥁",
                titolo: "Gara dei Musici",
                testo:
                  "Tamburi e chiarine vengono giudicati per precisione, armonia e spettacolarità.",
              },
              {
                emoji: "🚩",
                titolo: "Gara degli Sbandieratori",
                testo:
                  "Coreografie spettacolari e lanci sincronizzati esaltano la tradizione delle bandiere.",
              },
              {
                emoji: "🎭",
                titolo: "Premio Tema",
                testo:
                  "Ogni Contrada racconta una storia attraverso scenografie, costumi e interpretazione.",
              },
              {
                emoji: "🏆",
                titolo: "Premio Miglior Corteo",
                testo:
                  "Riconoscimento assegnato alla Contrada che realizza il corteo più suggestivo.",
              },
              {
                emoji: "🎨",
                titolo: "Premi Artistici",
                testo:
                  "Numerosi riconoscimenti dedicati ai costumi, alla creatività e alle scenografie.",
              },
              {
                emoji: "❤️",
                titolo: "Vita di Contrada",
                testo:
                  "Cene, feste, eventi e iniziative che animano Querceta durante tutto l'anno.",
              },
            ].map((evento) => (

              <div
                key={evento.titolo}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8"
              >

                <div className="text-5xl mb-5">
                  {evento.emoji}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {evento.titolo}
                </h3>

                <p className="leading-8">
                  {evento.testo}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA FINALE */}

      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-[#5C3A21] rounded-3xl text-white text-center p-16 shadow-2xl">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vivi il Palio come non hai mai fatto
            </h2>

            <p className="text-xl max-w-3xl mx-auto leading-9 mb-12">

              Scopri la storia delle Contrade, consulta gli Albi d'Oro e,
              soprattutto, prepara la tua squadra su <strong>FantaMiccio</strong>
              per vivere il Palio da protagonista.

            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">

              <Link
                href="/contrade"
                className="bg-white text-[#5C3A21] hover:bg-gray-100 transition px-8 py-4 rounded-xl font-bold"
              >
                Le Contrade
              </Link>

              <Link
                href="/albi-doro"
                className="bg-amber-600 hover:bg-amber-700 transition px-8 py-4 rounded-xl font-bold text-white"
              >
                Albi d'Oro
              </Link>

              <Link
                href="/login"
                className="border-2 border-white hover:bg-white hover:text-[#5C3A21] transition px-8 py-4 rounded-xl font-bold"
              >
                Accedi a FantaMiccio
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
      </>
  );
}
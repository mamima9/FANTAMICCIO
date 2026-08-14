import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Countdown from "@/components/Countdown";
import Footer from "@/components/layout/Footer";
import Contrade from "@/components/home/Contrade";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">

        <Hero />

        {/* COS'È FANTAMICCIO */}

        <section id="scopri" className="py-24 bg-[#F9F5EF]">
          <div className="max-w-5xl mx-auto">

            <h2 className="text-4xl font-bold text-center mb-8">
              🫏 Cos'è FantaMiccio?
            </h2>

            <p className="text-lg text-[#5C3A21] leading-8">
              <strong>FantaMiccio è il fantasy game dedicato al Palio dei Micci di Querceta.</strong>
              <br /><br />

              Vivi il Palio come mai prima d'ora.

              <br /><br />

              FantaMiccio trasforma la passione per il Palio dei Micci in una sfida continua tra Contrade.

              <br /><br />

              Scegli la Contrada che rappresenti, partecipa agli eventi  e conquista punti in ogni competizione.

              Ogni tua vittoria contribuirà a farti scalare la classifica dei Fantacontradaioli e aiutare la tua contrada nel confronto con le altre.

              <br /><br />

              Partecipa al Fanta Torneo di Calcio, pronostica il podio della corsa del miccio del Palio e metti alla prova le tue conoscenze in tutte le competizioni che accompagneranno il mondo del Palio durante l'anno.

              <br /><br />

              Anche se in un certo evento non puoi essere presente, puoi sostenere la tua Contrada e vivere la stessa esperienza: scegli quella per cui fai il tifo, rappresentala nelle classifiche e contribuisci a renderla la più popolare.
            </p>

            <div className="text-[#5C3A21]">
              
              <div>🛡️ <strong>Scegli la tua Contrada del cuore</strong></div>

              <div>⚽ <strong>Crea la squadra del Torneo di Calcio</strong></div>

              <div>🫏 <strong>Pronostica il podio nella corsa del miccio</strong></div>

              <div>🏆 <strong>Sfida amici e altri Fantacontradaioli</strong></div>

              <div>⭐ <strong>Fai crescere la popolarità della tua Contrada</strong></div>

              <div>👑 <strong>Diventa il miglior Fantacontradaiolo della stagione</strong></div>

              <div className="md:col-span-2">
                🎉 <strong>Vivi il Palio tutto l'anno attraverso eventi e nuove competizioni.</strong>
              </div>

            </div>

            <p className="mt-16 text-center text-2xl font-bold text-[#8B4513]">
              Per la prima volta il Palio non si vive soltanto nei giorni della manifestazione:
              <br />
              con FantaMiccio la rivalità tra Contrade continua tutto l'anno.
            </p>

          </div>
        </section>

        <Countdown />

        <Contrade />

      </main>

      <Footer />
    </>
  );
}
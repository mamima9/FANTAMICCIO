import Image from "next/image";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { contrade } from "@/data/contrade";

import { alboOro } from "@/data/alboOro";
import { alboOroCalcio } from "@/data/alboOroCalcio";
import { alboOroBandiera } from "@/data/alboOroBandiera";
import { alboOroTema } from "@/data/alboOroTema";
import { alboOroMeccheri } from "@/data/alboOroMeccheri";
import { alboOroMiccioCanterino } from "@/data/alboOroMiccioCanterino";
import { alboOroStaffetta } from "@/data/alboOroStaffetta";
import { alboOroAlabarda } from "@/data/alboOroAlabarda";
import { alboOroCorteoStorico } from "@/data/alboOroCorteoStorico";
import { alboOroCoppaPresidente } from "@/data/alboOroCoppaPresidente";
import { alboOroMissPalio } from "@/data/alboOroMissPalio";

function getContrada(id: string) {
  return contrade.find((c) => c.id === id);
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const competizioni = {
  corsa: {
    titolo: "🐴 Corsa del Miccio",
    dati: alboOro,
  },
  "coppa-presidente": {
    titolo: "👑 Coppa del Presidente",
    dati: alboOroCoppaPresidente,
  },
  calcio: {
    titolo: "⚽ Calcio",
    dati: alboOroCalcio,
  },
  tema: {
    titolo: "🎭 Tema",
    dati: alboOroTema,
  },
  meccheri: {
    titolo: "🥁 Trofeo Meccheri",
    dati: alboOroMeccheri,
  },
  "miccio-canterino": {
    titolo: "🎤 Miccio Canterino",
    dati: alboOroMiccioCanterino,
  },
  staffetta: {
    titolo: "🏃 Staffetta",
    dati: alboOroStaffetta,
  },
  bandiera: {
    titolo: "🚩 Bandiera",
    dati: alboOroBandiera,
  },
  alabarda: {
    titolo: "⚔️ Alabarda",
    dati: alboOroAlabarda,
  },
  "corteo-storico": {
    titolo: "👗 Corteo Storico",
    dati: alboOroCorteoStorico,
  },
  "miss-palio": {
    titolo: "💃 Miss Palio",
    dati: alboOroMissPalio,
  },
};

export default async function GaraPage({ params }: Props) {
  const { slug } = await params;

  const gara = competizioni[slug as keyof typeof competizioni];

  if (!gara) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F9F5EF] py-12">
        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-[#5C3A21]">
              {gara.titolo}
            </h1>

            <div className="w-32 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full"></div>

            <p className="mt-5 text-lg text-[#7A5230]">
              Albo d'Oro ufficiale del Palio dei Micci
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border-2 border-[#D4AF37] bg-white shadow-2xl">

            <table className="w-full">

              <thead>
                <tr className="bg-gradient-to-r from-[#5C3A21] to-[#7A5230] text-[#F4D35E]">

                  <th className="p-5 text-left text-lg">
                    Anno
                  </th>

                  <th className="p-5 text-left text-lg">
                    Vincitore
                  </th>

                </tr>
              </thead>

              <tbody>

                {gara.dati.map((entry: any) => {

                  const contrada = entry.vincitore
                    ? getContrada(entry.vincitore)
                    : null;

                  return (
                    <tr
                      key={entry.anno}
                      className="border-t border-[#E6D8B8] hover:bg-[#FFF8E7] transition duration-200"
                    >

                      <td className="p-5 font-bold text-[#5C3A21] text-lg">
                        {entry.anno}
                      </td>

                      <td className="p-5">

                        {contrada ? (

                          <div className="flex items-center gap-4">

                            <div className="rounded-full border-2 border-[#D4AF37] p-1 bg-white">

                              <Image
                                src={contrada.stemma}
                                alt={contrada.nome}
                                width={42}
                                height={42}
                              />

                            </div>

                            <span className="text-lg font-semibold text-[#5C3A21]">
                              {contrada.nome}
                            </span>

                          </div>

                        ) : (

                          <span className="italic text-[#8B6B3D]">
                            {entry.motivo}
                          </span>

                        )}

                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
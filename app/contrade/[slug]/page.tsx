import { notFound } from "next/navigation";

import { contrade } from "@/data/contrade";

import { cerviaInfo } from "@/data/contradeInfo/cervia";
import { leondoroInfo } from "@/data/contradeInfo/leondoro";
import { lucertolaInfo } from "@/data/contradeInfo/lucertola";
import { madonninaInfo } from "@/data/contradeInfo/madonnina";
import { ponteInfo } from "@/data/contradeInfo/ponte";
import { pozzoInfo } from "@/data/contradeInfo/pozzo";
import { querciaInfo } from "@/data/contradeInfo/quercia";
import { ranocchioInfo } from "@/data/contradeInfo/ranocchio";

const infoContrade = {
  cervia: cerviaInfo,
  leondoro: leondoroInfo,
  lucertola: lucertolaInfo,
  madonnina: madonninaInfo,
  ponte: ponteInfo,
  pozzo: pozzoInfo,
  quercia: querciaInfo,
  ranocchio: ranocchioInfo,
};

export default async function ContradaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const contrada = contrade.find((c) => c.id === slug);
  const info = infoContrade[slug as keyof typeof infoContrade];

  if (!contrada || !info) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">

      {/* HERO */}

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900">
          {contrada.nome}
        </h1>

        <div className="w-32 h-1 bg-amber-500 rounded-full mx-auto my-6"></div>

        <div className="flex justify-center gap-3 mb-6">

          <span
            className="w-8 h-8 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: contrada.colori.primario }}
          />

          <span
            className="w-8 h-8 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: contrada.colori.secondario }}
          />

          {contrada.colori.terziario && (
            <span
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: contrada.colori.terziario }}
            />
          )}

        </div>

        <p className="text-xl text-gray-700">{info.colori}</p>

        <p className="mt-2 text-lg font-semibold text-amber-700">
          Periodo storico: {info.periodoStorico}
        </p>

      </section>

      {/* Cenni Storici */}

      <section className="max-w-5xl mx-auto px-6 mb-10">

        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            📜 Cenni Storici
          </h2>

          <p className="leading-8 whitespace-pre-line text-gray-700">
            {info.cenniStorici}
          </p>

        </div>

      </section>

      {/* Leggenda */}

      <section className="max-w-5xl mx-auto px-6 mb-10">

        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            ✨ Fra leggenda e realtà
          </h2>

          <p className="leading-8 whitespace-pre-line text-gray-700">
            {info.leggenda}
          </p>

        </div>

      </section>

      {/* Oggi */}

      <section className="max-w-5xl mx-auto px-6 pb-20">

        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            🏡 La Contrada oggi
          </h2>

          <p className="leading-8 whitespace-pre-line text-gray-700">
            {info.oggi}
          </p>

        </div>

      </section>

    </main>
  );
}
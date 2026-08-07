"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ClassifichePage() {

  const supabase = createClient();

  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadRanking() {

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          points_awarded,
          profiles (
            username,
            contrada_id,
            Contrade (
              nome
            )
          )
        `);


      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }


      const users: any = {};


      data?.forEach((prediction: any) => {

        const profile = prediction.profiles;

        if (!profile) return;


        const username = profile.username;


        if (!users[username]) {

          users[username] = {
            username,
            contrada:
              profile.Contrade?.nome ?? "-",
            punti: 0,
          };

        }


        users[username].punti +=
          prediction.points_awarded ?? 0;

      });



      const sorted = Object.values(users)
        .sort(
          (a:any,b:any) =>
            b.punti - a.punti
        );


      setRanking(sorted);
      setLoading(false);

    }


    loadRanking();

  }, []);



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


          {ranking.slice(0,3).map((utente,index)=>(

            <div
              key={utente.username}
              className={`bg-white rounded-3xl shadow-xl p-8 text-center ${
                index === 0
                ? "bg-[#D4AF37] scale-105"
                : ""
              }`}
            >

              <div className="text-6xl">
                {index === 0 ? "🥇" :
                 index === 1 ? "🥈" :
                 "🥉"}
              </div>


              <h3 className="mt-4 text-3xl font-black">
                {utente.username}
              </h3>


              <p>
                🏰 {utente.contrada}
              </p>


              <p className="mt-4 text-4xl font-black text-red-600">
                {utente.punti}
              </p>


            </div>

          ))}


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

                <th className="p-5 text-left">
                  #
                </th>

                <th className="p-5 text-left">
                  Contradaiolo
                </th>

                <th className="p-5 text-left">
                  Contrada
                </th>

                <th className="p-5 text-right">
                  Punti
                </th>

              </tr>

            </thead>



            <tbody>


              {loading ? (

                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center"
                  >
                    Caricamento...
                  </td>
                </tr>


              ) : (


                ranking.map((utente,index)=>(

                  <tr
                    key={utente.username}
                    className="border-b hover:bg-amber-50 transition"
                  >

                    <td className="p-5 font-bold">
                      {index + 1}
                    </td>


                    <td className="p-5">
                      {utente.username}
                    </td>


                    <td className="p-5">
                      {utente.contrada}
                    </td>


                    <td className="p-5 text-right font-bold">
                      {utente.punti}
                    </td>


                  </tr>


                ))

              )}


            </tbody>


          </table>


        </div>


      </section>


    </main>
  );
}
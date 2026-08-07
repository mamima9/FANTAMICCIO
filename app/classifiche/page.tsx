"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ClassifichePage() {

  const supabase = createClient();

  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("generale");
  const [categoryRanking, setCategoryRanking] = useState<any[]>([]);
const [categoryLoading, setCategoryLoading] = useState(false);
const [contradeRanking, setContradeRanking] = useState<any[]>([]);
const [contradeLoading, setContradeLoading] = useState(false);
const [singolaContradaRanking, setSingolaContradaRanking] = useState<any[]>([]);
const [singolaContradaLoading, setSingolaContradaLoading] = useState(false);
const [popolaritaRanking, setPopolaritaRanking] = useState<any[]>([]);
const [popolaritaLoading, setPopolaritaLoading] = useState(false);

  useEffect(() => {

    async function loadRanking() {
      const { data, error } = await supabase
  .from("predictions")
  .select(`
    points_awarded,
    profiles (
      username,
      contrada_id
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
  profile.contrada_id ?? "-",
            punti: 0,
          };

        }


        users[username].punti +=
          prediction.points_awarded ?? 0;

      });



      const sorted = Object.values(users)
        .sort(
          (a: any, b: any) =>
            b.punti - a.punti
        );


      setRanking(sorted);
      setLoading(false);

    }


    loadRanking();

  }, []);

async function loadCategoryRanking(category: string) {

  setCategoryLoading(true);


  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id")
    .eq("category", category);


  if (eventsError) {
    console.error(eventsError);
    setCategoryLoading(false);
    return;
  }


  const eventIds = events.map(
    (event) => event.id
  );


  if (eventIds.length === 0) {
    setCategoryRanking([]);
    setCategoryLoading(false);
    return;
  }


  const { data, error } = await supabase
    .from("predictions")
    .select(`
      points_awarded,
      profiles (
        username,
        contrada_id
      )
    `)
    .in("event_id", eventIds);


  if (error) {
    console.error(error);
    setCategoryLoading(false);
    return;
  }


  const users: any = {};


  data?.forEach((prediction: any) => {

    const profile = prediction.profiles;

    if (!profile) return;


    if (!users[profile.username]) {

      users[profile.username] = {
        username: profile.username,
        contrada: profile.contrada_id,
        punti: 0,
      };

    }


    users[profile.username].punti +=
      prediction.points_awarded ?? 0;

  });


  const sorted = Object.values(users)
    .sort(
      (a: any, b: any) =>
        b.punti - a.punti
    );


  setCategoryRanking(sorted);
  setCategoryLoading(false);

}

async function loadContradeRanking() {

  setContradeLoading(true);


  const { data, error } = await supabase
    .from("predictions")
    .select(`
      points_awarded,
      profiles (
        contrada_id
      )
    `);


  if (error) {
    console.error(error);
    setContradeLoading(false);
    return;
  }


  const contrade: any = {};


  data?.forEach((prediction:any)=>{

    const profile = prediction.profiles;

    if(!profile) return;


    const nomeContrada = profile.contrada_id;


    if(!contrade[nomeContrada]){

      contrade[nomeContrada] = {
        nome: nomeContrada,
        punti: 0
      };

    }


    contrade[nomeContrada].punti +=
      prediction.points_awarded ?? 0;


  });



  const sorted = Object.values(contrade)
    .sort(
      (a:any,b:any)=>
        b.punti-a.punti
    );


  setContradeRanking(sorted);
  setContradeLoading(false);

}

async function loadSingolaContradaRanking() {

  setSingolaContradaLoading(true);


  const { data, error } = await supabase
    .from("predictions")
    .select(`
      points_awarded,
      profiles (
        username,
        contrada_id
      )
    `);


  if (error) {
    console.error(error);
    setSingolaContradaLoading(false);
    return;
  }


  const users: any = {};


  data?.forEach((prediction:any)=>{

    const profile = prediction.profiles;

    if(!profile) return;


    const key = profile.contrada_id;


    if(!users[key]){
      users[key] = [];
    }


    const existing = users[key]
      .find(
        (u:any)=>u.username === profile.username
      );


    if(existing){

      existing.punti +=
        prediction.points_awarded ?? 0;

    } else {

      users[key].push({

        username: profile.username,

        contrada: profile.contrada_id,

        punti:
          prediction.points_awarded ?? 0

      });

    }


  });



  const result = Object.keys(users).map(
    (contrada)=>({

      nome: contrada,

      utenti:
        users[contrada]
          .sort(
            (a:any,b:any)=>
              b.punti-a.punti
          )

    })
  );


  setSingolaContradaRanking(result);

  setSingolaContradaLoading(false);

}

async function loadPopolaritaRanking() {

  setPopolaritaLoading(true);


  const { data, error } = await supabase
    .from("profiles")
    .select("contrada_id");


  if (error) {
    console.error(error);
    setPopolaritaLoading(false);
    return;
  }


  const contrade:any = {};


  data?.forEach((profile:any)=>{

    const nome = profile.contrada_id;

    if(!nome) return;


    if(!contrade[nome]){
      contrade[nome] = {
        nome,
        iscritti: 0
      };
    }


    contrade[nome].iscritti++;

  });



  const sorted = Object.values(contrade)
    .sort(
      (a:any,b:any)=>
        b.iscritti-a.iscritti
    );


  setPopolaritaRanking(sorted);
  setPopolaritaLoading(false);

}

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
              href="/dashboard/vita-da-contrada"
              className="bg-white text-red-700 font-bold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              ← Vita di Contrada
            </Link>


          </div>

        </div>

      </section>

      {/* TAB CLASSIFICHE */}

<section className="max-w-7xl mx-auto px-6 pt-10">

  <div className="flex flex-wrap justify-center gap-4">

    {[
      {
        id: "generale",
        label: "🏆 Generale"
      },
      {
        id: "canterino",
        label: "🎤 MiccioCanterino"
      },
      {
        id: "calcio",
        label: "⚽ Calcio"
      },
      {
        id: "popolarita",
        label: " ⭐ Popolarità"
      },
      {
        id: "generale-contrade",
        label: "🏰 8 Contrade"
      },
      {
 id:"singola-contrada",
 label: "🚩 Singola Contrada"
}

    ].map((tab) => (

      <button
        key={tab.id}
        onClick={() => {

  setActiveTab(tab.id);


  if(tab.id === "canterino"){
    loadCategoryRanking("canterino");
  }


  if(tab.id === "calcio"){
    loadCategoryRanking("calcio");
  }

if(tab.id === "generale-contrade"){
  loadContradeRanking();
}
if(tab.id === "singola-contrada"){
  loadSingolaContradaRanking();
}
if(tab.id === "popolarita"){
  loadPopolaritaRanking();
}
}}
        className={`px-6 py-3 rounded-2xl font-bold transition ${
          activeTab === tab.id
            ? "bg-[#5C3A21] text-white"
            : "bg-white text-[#5C3A21] shadow"
        }`}
      >
        {tab.label}
      </button>

    ))}

  </div>

</section>


      {/* PODIO */}

      {activeTab === "generale" && (

      <section className="max-w-7xl mx-auto px-6 py-16">


        <div className="grid md:grid-cols-3 gap-8">


          {ranking.slice(0, 3).map((utente, index) => (


            <div
              key={utente.username}
              className={`rounded-3xl shadow-xl p-8 text-center ${
                index === 0
                  ? "bg-[#D4AF37] scale-105"
                  : "bg-white"
              }`}
            >


              <div className="text-6xl">

                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : "🥉"}

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

)}

{activeTab === "singola-contrada" && (

<section className="max-w-7xl mx-auto px-6 pb-20">

  <div className="space-y-8">


    {singolaContradaLoading ? (

      <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
        Caricamento...
      </div>


    ) : (

      singolaContradaRanking.map((contrada:any) => (

        <div
          key={contrada.nome}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >


          {/* HEADER CONTRADA */}

          <div className="bg-[#5C3A21] text-white p-6">

            <h2 className="text-3xl font-black">
              🏰 {contrada.nome}
            </h2>

          </div>



          {/* CLASSIFICA INTERNA */}

          <table className="w-full">


            <thead className="bg-gray-100">

              <tr>

                <th className="p-5 text-left">
                  #
                </th>

                <th className="p-5 text-left">
                  Contradaiolo
                </th>

                <th className="p-5 text-right">
                  Punti
                </th>

              </tr>

            </thead>



            <tbody>


              {contrada.utenti.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="p-8 text-center text-gray-500"
                  >
                    Nessun partecipante
                  </td>

                </tr>


              ) : (


                contrada.utenti.map(
                  (utente:any,index:number)=>(

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


                    <td className="p-5 text-right font-bold">
                      {utente.punti}
                    </td>


                  </tr>

                ))

              )}


            </tbody>


          </table>


        </div>


      ))

    )}


  </div>


</section>

)}

      {/* CLASSIFICA */}

      {activeTab === "generale" && (

      <section className="max-w-7xl mx-auto px-6 pb-20">


        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">


          <div className="bg-[#5C3A21] text-white p-6">


            <h2 className="text-3xl font-black">
              📋 Classifica Generale
            </h2>


          </div>




          <div className="overflow-x-auto">


            <table className="w-full min-w-[600px]">


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



                ) : ranking.length === 0 ? (


                  <tr>

                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-500"
                    >
                      Nessun punteggio disponibile.
                    </td>

                  </tr>



                ) : (


                  ranking.map((utente, index) => (


                    <tr
                      key={utente.username}
                      className="border-b hover:bg-amber-50 transition"
                    >


                      <td className="p-5 font-bold">
                        {index + 1}
                      </td>



                      <td className="p-5 whitespace-nowrap">
                        {utente.username}
                      </td>



                      <td className="p-5 whitespace-nowrap">
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


        </div>


      </section>

              )}
                {(activeTab === "canterino" || activeTab === "calcio") && (

<section className="max-w-7xl mx-auto px-6 pb-20">

  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

    <div className="bg-[#5C3A21] text-white p-6">

      <h2 className="text-3xl font-black">
        {activeTab === "canterino"
          ? "🎤 Classifica MiccioCanterino"
          : "⚽ Classifica Torneo Calcio"}
      </h2>

    </div>


    <table className="w-full min-w-[600px]">

      <thead className="bg-gray-100">

        <tr>
          <th className="p-5 text-left">#</th>
          <th className="p-5 text-left">Contradaiolo</th>
          <th className="p-5 text-left">Contrada</th>
          <th className="p-5 text-right">Punti</th>
        </tr>

      </thead>


      <tbody>

      {categoryLoading ? (

        <tr>
          <td colSpan={4} className="p-8 text-center">
            Caricamento...
          </td>
        </tr>

      ) : (

        categoryRanking.map((utente,index)=>(

          <tr key={utente.username}
          className="border-b">

            <td className="p-5">
              {index+1}
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

)}
{activeTab === "generale-contrade" && (

<section className="max-w-7xl mx-auto px-6 pb-20">

<div className="bg-white rounded-3xl shadow-xl overflow-hidden">


<div className="bg-[#5C3A21] text-white p-6">

<h2 className="text-3xl font-black">
🏰 Classifica 8 Contrade
</h2>

</div>


<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-5 text-left">
#
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


{contradeLoading ? (

<tr>
<td colSpan={3} className="p-8 text-center">
Caricamento...
</td>
</tr>


) : (

contradeRanking.map((contrada,index)=>(

<tr
key={contrada.nome}
className="border-b hover:bg-amber-50"
>

<td className="p-5 font-bold">
{index+1}
</td>


<td className="p-5 font-bold">
🏰 {contrada.nome}
</td>


<td className="p-5 text-right font-bold">
{contrada.punti}
</td>


</tr>

))

)}


</tbody>


</table>


</div>

</section>

)}

{activeTab === "popolarita" && (

<section className="max-w-7xl mx-auto px-6 pb-20">

  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">


    <div className="bg-[#5C3A21] text-white p-6">

      <h2 className="text-3xl font-black">
        👥 Popolarità Contrade
      </h2>

    </div>



    <table className="w-full">


      <thead className="bg-gray-100">

        <tr>

          <th className="p-5 text-left">
            #
          </th>

          <th className="p-5 text-left">
            Contrada
          </th>

          <th className="p-5 text-right">
            Iscritti
          </th>

        </tr>

      </thead>



      <tbody>


      {popolaritaLoading ? (

        <tr>
          <td
            colSpan={3}
            className="p-8 text-center"
          >
            Caricamento...
          </td>
        </tr>


      ) : (


        popolaritaRanking.map((contrada,index)=>(

          <tr
            key={contrada.nome}
            className="border-b hover:bg-amber-50 transition"
          >

            <td className="p-5 font-bold">
              {index + 1}
            </td>


            <td className="p-5 font-bold">
              🏰 {contrada.nome}
            </td>


            <td className="p-5 text-right font-bold">
              {contrada.iscritti}
            </td>


          </tr>

        ))


      )}


      </tbody>


    </table>


  </div>

</section>

)}


    </main>

  );

}
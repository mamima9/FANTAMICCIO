"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

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
const [selectedContrada, setSelectedContrada] = useState("Cervia");
const stemmiContrade: Record<string, string> = {
  "Cervia": "/contrade/cervia.png",
  "Leon d'Oro": "/contrade/leondoro.png",
  "Lucertola": "/contrade/lucertola.png",
  "Madonnina": "/contrade/madonnina.png",
  "Ponte": "/contrade/ponte.png",
  "Pozzo": "/contrade/pozzo.png",
  "Quercia": "/contrade/quercia.png",
  "Ranocchio": "/contrade/ranocchio.png",
};

const coloriContrade: Record<
  string,
  { primario: string; secondario: string }
> = {
  "Cervia": {
    primario: "#87CEEB",
    secondario: "#FFFFFF",
  },

  "Leon d'Oro": {
    primario: "#FFD700",
    secondario: "#D00000",
  },

  "Lucertola": {
    primario: "#D00000",
    secondario: "#008000",
  },

  "Madonnina": {
    primario: "#008CFF",
    secondario: "#FFD700",
  },

  "Ponte": {
    primario: "#D00000",
    secondario: "#0057B8",
  },

  "Pozzo": {
    primario: "#FFFFFF",
    secondario: "#D00000",
  },

  "Quercia": {
    primario: "#FFFFFF",
    secondario: "#111111",
  },

  "Ranocchio": {
    primario: "#FFD700",
    secondario: "#008000",
  },
};
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
  contrada: profile.contrada_id ?? "-",
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


  // prendiamo tutte le 8 contrade
  const { data: allContrade, error: contradeError } = await supabase
    .from("Contrade")
    .select("nome")
    .order("nome");


  if (contradeError) {
    console.error(contradeError);
    setContradeLoading(false);
    return;
  }



  // prendiamo i punti dai pronostici

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
    setContradeLoading(false);
    return;
  }



  const puntiContrade:any = {};



  // inizializziamo tutte le contrade a 0

  allContrade?.forEach((contrada:any)=>{

    puntiContrade[contrada.nome] = {
      nome: contrada.nome,
      punti: 0
    };

  });



  // sommiamo i punti

  data?.forEach((prediction:any)=>{


    const profile = prediction.profiles;


    if(!profile) return;


    const nome = profile.contrada_id;


    if(puntiContrade[nome]){

      puntiContrade[nome].punti +=
        prediction.points_awarded ?? 0;

    }


  });



  const sorted = Object.values(puntiContrade)
    .sort(
      (a:any,b:any)=>
        b.punti - a.punti
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

  const nomiContrade: Record<string, string> = {
    "1": "Cervia",
    "2": "Leon d'Oro",
    "3": "Lucertola",
    "4": "Madonnina",
    "5": "Ponte",
    "6": "Pozzo",
    "7": "Quercia",
    "8": "Ranocchio",
  };

  data?.forEach((prediction: any) => {
    const profile = prediction.profiles;

    if (!profile) return;

    const key = profile.contrada_id;

    if (!users[key]) {
      users[key] = [];
    }

    const existing = users[key].find(
      (u: any) => u.username === profile.username
    );

    if (existing) {
      existing.punti +=
        prediction.points_awarded ?? 0;
    } else {
      users[key].push({
        username: profile.username,

        contrada:
          nomiContrade[String(profile.contrada_id)] ?? "-",

        punti:
          prediction.points_awarded ?? 0,
      });
    }
  });

  const result = Object.keys(users).map(
    (contrada) => ({
      nome:
        nomiContrade[contrada] ?? "-",

      utenti:
        users[contrada].sort(
          (a: any, b: any) =>
            b.punti - a.punti
        ),
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

          {/* CLASSIFICA INTERNA */}

         {activeTab === "singola-contrada" && (

  <section className="max-w-7xl mx-auto px-6 pb-20">

    {/* SELETTORE CONTRADA */}

    <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

      {singolaContradaRanking.map((contrada: any) => (

        <button
          key={contrada.nome}
          onClick={() => setSelectedContrada(contrada.nome)}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition ${
            selectedContrada === contrada.nome
              ? "bg-[#5C3A21] text-white shadow-lg scale-105"
              : "bg-white text-[#5C3A21] shadow hover:scale-105"
          }`}
        >
          {contrada.nome}
        </button>

      ))}

    </div>


    {/* CONTRADA SELEZIONATA */}

    {singolaContradaLoading ? (

      <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
        Caricamento...
      </div>

    ) : (

      (() => {

        const contrada = singolaContradaRanking.find(
          (c: any) => c.nome === selectedContrada
        );

        if (!contrada) return null;

        return (

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* HEADER */}

            <div
              className="p-6"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${coloriContrade[contrada.nome]?.primario ?? "#5C3A21"},
                  ${coloriContrade[contrada.nome]?.secondario ?? "#D4AF37"}
                )`,
              }}
            >

              <div className="flex items-center gap-4">

                {stemmiContrade[contrada.nome] && (
                  <Image
                    src={stemmiContrade[contrada.nome]}
                    alt={`Stemma ${contrada.nome}`}
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                )}

                <h2 className="text-3xl font-black text-[#5C3A21]">
                  {contrada.nome}
                </h2>

              </div>

            </div>


            {/* TABELLA */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[500px]">

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
                      (utente: any, index: number) => (

                        <tr
                          key={utente.username}
                          className="border-b hover:bg-amber-50 transition"
                        >

                          <td className="p-5 font-bold">
                            {index + 1}
                          </td>

                         <td className="p-5">
  <div className="flex items-center gap-3">

    {stemmiContrade[utente.contrada] && (
      <Image
        src={stemmiContrade[utente.contrada]}
        alt={`Stemma ${utente.contrada}`}
        width={45}
        height={45}
        className="object-contain"
      />
    )}

    <span className="font-semibold">
      {utente.contrada}
    </span>

  </div>
</td>

                          <td className="p-5 text-right font-bold">
                            {utente.punti}
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        );

      })()

    )}

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
<div className="flex items-center gap-4">

  {stemmiContrade[contrada.nome] && (
    <Image
      src={stemmiContrade[contrada.nome]}
      alt={`Stemma ${contrada.nome}`}
      width={55}
      height={55}
      className="object-contain"
    />
  )}

  <span>
    {contrada.nome}
  </span>

</div>
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
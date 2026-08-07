"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  prediction_deadline: string | null;
  status: string;
};

type Contrada = {
  id: number;
  nome: string;
  stemma?: string;
};

export default function EventPage() {
  const supabase = createClient();
  const params = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [contrade, setContrade] = useState<Contrada[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    winner: "",
    second: "",
    third: "",
  });


  useEffect(() => {
    async function loadData() {

      const [
        { data: eventData, error: eventError },
        { data: contradeData, error: contradeError },
      ] = await Promise.all([

        supabase
          .from("events")
          .select(
            "id,title,description,event_date,prediction_deadline,status"
          )
          .eq("slug", params.slug as string)
          .single(),

        supabase
          .from("Contrade")
          .select("id,nome")
          .order("nome"),

      ]);


      if (eventError) {
        console.error(eventError);
        alert("Evento non trovato.");
        return;
      }


      if (contradeError) {
        console.error(contradeError);
      }


      setEvent(eventData);

      setContrade(contradeData ?? []);

      setLoading(false);
    }


    if (params.slug) {
      loadData();
    }

  }, [params.slug]);


  async function handleSave() {

 if (event?.status !== "OPEN") {
      alert("I pronostici sono chiusi.");
      return;
    }

    if (
      !form.winner ||
      !form.second ||
      !form.third
    ) {
      alert("Seleziona primo, secondo e terzo posto.");
      return;
    }


    setSaving(true);


    const {
      data: {
        user
      },
    } = await supabase.auth.getUser();


    if (!user) {
      alert("Devi effettuare il login.");
      setSaving(false);
      return;
    }


    const { error } = await supabase
      .from("predictions")
      .insert({
        event_id: event?.id,
        user_id: user.id,

        prediction: {
          winner: Number(form.winner),
          second: Number(form.second),
          third: Number(form.third),
        },

        points_awarded: 0,
      });


    setSaving(false);


    if (error) {
      console.error(error);
      alert("Errore nel salvataggio del pronostico.");
      return;
    }


    alert("Pronostico salvato!");
  }


    if (loading) {
    return (
      <main className="p-8">
        <p>Caricamento...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="p-8">
        <p>Evento non trovato.</p>
      </main>
    );
  }
    return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <section className="bg-gradient-to-r from-red-900 via-red-700 to-yellow-600 text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-6">

          <h1 className="text-5xl font-black">
             🫏 {event.title}
          </h1>

          <p className="mt-4 text-xl">
            {event.description ??
              "Scegli il tuo pronostico."}
          </p>

        </div>
      </section>


{event.status === "OPEN" ? (

      <section className="max-w-4xl mx-auto py-16 px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h2 className="text-4xl font-black text-center text-[#5C3A21] mb-10">
            Pronostico
          </h2>


          <div className="space-y-6">


            <div>
              <label className="block font-bold mb-2">
                🥇 Primo posto
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={form.winner}
                onChange={(e) =>
                  setForm({
                    ...form,
                    winner: e.target.value,
                  })
                }
              >

                <option value="">
                  Seleziona contrada
                </option>

                {contrade.map((contrada) => (
                  <option
                    key={contrada.id}
                    value={contrada.id}
                  >
                    {contrada.nome}
                  </option>
                ))}

              </select>

            </div>



            <div>
              <label className="block font-bold mb-2">
                🥈 Secondo posto
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={form.second}
                onChange={(e) =>
                  setForm({
                    ...form,
                    second: e.target.value,
                  })
                }
              >

                <option value="">
                  Seleziona contrada
                </option>

                {contrade.map((contrada) => (
                  <option
                    key={contrada.id}
                    value={contrada.id}
                  >
                    {contrada.nome}
                  </option>
                ))}

              </select>

            </div>




            <div>
              <label className="block font-bold mb-2">
                🥉 Terzo posto
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={form.third}
                onChange={(e) =>
                  setForm({
                    ...form,
                    third: e.target.value,
                  })
                }
              >

                <option value="">
                  Seleziona contrada
                </option>

                {contrade.map((contrada) => (
                  <option
                    key={contrada.id}
                    value={contrada.id}
                  >
                    {contrada.nome}
                  </option>
                ))}

              </select>

            </div>



            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-2xl bg-red-700 py-4 text-xl font-bold text-white hover:bg-red-800 disabled:opacity-50"
            >
              {saving
                ? "Salvataggio..."
                : "CONFERMA PRONOSTICO"}
            </button>


          </div>

        </div>

      </section>

) : (

  <section className="max-w-4xl mx-auto py-16 px-6">

    <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

      <h2 className="text-3xl font-black text-[#5C3A21]">
        🔒 Pronostici chiusi
      </h2>

      <p className="mt-4 text-gray-600">
        Non è più possibile inserire pronostici per questo evento.
      </p>

    </div>

  </section>

)}

      <section className="max-w-5xl mx-auto pb-20 px-6">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#5C3A21] text-white text-center py-5">

            <h2 className="text-3xl font-black">
              🏆 Punteggi
            </h2>
          </div>


          <table className="w-full">

            <tbody>

              <tr className="border-b">
                <td className="p-5">
                  🥇 Primo posto
                </td>

                <td className="p-5 text-right font-bold">
                  100
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-5">
                  🥈 Secondo posto
                </td>

                <td className="p-5 text-right font-bold">
                  60
                </td>
              </tr>


              <tr>
                <td className="p-5">
                  🥉 Terzo posto
                </td>

                <td className="p-5 text-right font-bold">
                  30
                </td>
              </tr>


            </tbody>

          </table>

        </div>

      </section>



      <div className="text-center pb-10">

        <Link
          href="/eventi"
          className="text-red-700 font-bold hover:underline"
        >
          ← Torna agli Eventi
        </Link>

      </div>


    </main>
  );
}
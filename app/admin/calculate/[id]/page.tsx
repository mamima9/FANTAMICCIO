"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculatePoints } from "@/lib/calculatePoints";

type Event = {
  id: string;
  title: string;
  winner_contrada_id: number | null;
  second_contrada_id: number | null;
  third_contrada_id: number | null;
};

type Contrada = {
  id: number;
  nome: string;
};

export default function CalculatePointsPage() {
  const supabase = createClient();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const [event, setEvent] = useState<Event | null>(null);
  const [contrade, setContrade] = useState<Contrada[]>([]);
  const [predictionsCount, setPredictionsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [
        { data: event, error: eventError },
        { data: contrade, error: contradeError },
        { count },
      ] = await Promise.all([
        supabase
          .from("events")
          .select(
            "id,title,winner_contrada_id,second_contrada_id,third_contrada_id"
          )
          .eq("id", params.id as string)
          .single(),

        supabase
          .from("Contrade")
          .select("id,nome")
          .order("nome"),

        supabase
          .from("predictions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("event_id", params.id as string),
      ]);

      if (eventError) {
        console.error(eventError);
        alert("Evento non trovato.");
        return;
      }

      if (contradeError) {
        console.error(contradeError);
      }

      setEvent(event);
      setContrade(contrade ?? []);
      setPredictionsCount(count ?? 0);
      setLoading(false);
    }

    loadData();
  }, [params.id]);

  function getContradaName(id: number | null) {
    if (!id) return "-";

    return (
      contrade.find((c) => c.id === id)?.nome ??
      "-"
    );
  }


    async function handleCalculate() {
    try {
      setCalculating(true);

      const updated = await calculatePoints(
        params.id as string
      );

      // Imposta evento come completato
      const { error } = await supabase
        .from("events")
        .update({
          status: "COMPLETED",
        })
        .eq("id", params.id as string);

      if (error) {
        console.error(error);
        throw error;
      }

      alert(
        `✅ Calcolo completato!\n\n${updated} pronostici aggiornati.\n\nEvento impostato come COMPLETED.`
      );

    } catch (error) {
      console.error(error);
      alert("Errore durante il calcolo.");
    } finally {
      setCalculating(false);
    }
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
    <main className="max-w-4xl p-8">

      <h1 className="mb-8 text-3xl font-bold">
        ⚡ Calcolo punti
      </h1>

      <div className="rounded-xl border p-6 space-y-4">

        <div>
          <h2 className="text-xl font-semibold">
            {event.title}
          </h2>
        </div>

        <div>
          <p>
            <strong>🥇 Vincitore:</strong>{" "}
            {getContradaName(event.winner_contrada_id)}
          </p>

          <p>
            <strong>🥈 Secondo:</strong>{" "}
            {getContradaName(event.second_contrada_id)}
          </p>

          <p>
            <strong>🥉 Terzo:</strong>{" "}
                        {getContradaName(event.third_contrada_id)}
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-lg">
            <strong>Pronostici ricevuti:</strong>{" "}
            {predictionsCount}
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="rounded bg-amber-600 px-6 py-3 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {calculating
              ? "Calcolo in corso..."
              : "⚡ Calcola punti"}
          </button>
        </div>

      </div>

    </main>
  );
}
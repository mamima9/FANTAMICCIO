"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  event_date: string;
  results_published: boolean;
};

export default function CalculatePage() {
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,event_date,results_published")
        .eq("results_published", true)
        .order("event_date", { ascending: false });

      if (!error && data) {
        setEvents(data);
      }

      setLoading(false);
    }

    loadEvents();
  }, []);

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">⚡ Calcolo punti</h1>

        <p className="text-gray-500">
          Calcola i punti dei pronostici degli utenti.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Evento</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-center">Azione</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center">
                  Caricamento...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center">
                  Nessun evento con risultati pubblicati.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>

                  <td className="p-3">
                    {new Date(event.event_date).toLocaleDateString("it-IT")}
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/calculate/${event.id}`}
                      className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                    >
                      Calcola punti
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
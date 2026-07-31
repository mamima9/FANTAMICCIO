"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  event_date: string;
  status: string;
  results_published: boolean;
};

export default function ResultsPage() {
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,event_date,status,results_published")
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
        <h1 className="text-3xl font-bold">🏁 Risultati</h1>
        <p className="text-gray-500">
          Inserisci e pubblica i risultati ufficiali degli eventi.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-3 text-left">Evento</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Stato</th>
              <th className="p-3 text-left">Risultati</th>
              <th className="p-3 text-center">Azioni</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Caricamento...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Nessun evento presente.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>

                  <td className="p-3">
                    {new Date(event.event_date).toLocaleDateString("it-IT")}
                  </td>

                  <td className="p-3">{event.status}</td>

                  <td className="p-3">
                    {event.results_published ? "✅ Pubblicati" : "❌ Non pubblicati"}
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/results/${event.id}`}
                      className="rounded bg-amber-600 px-3 py-2 text-white hover:bg-amber-700"
                    >
                      Inserisci risultati
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
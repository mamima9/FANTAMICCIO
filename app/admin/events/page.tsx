"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  event_type: string;
  season: number;
  event_date: string;
  status: string;
};

export default function EventsPage() {
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📅 Eventi</h1>
          <p className="text-gray-500">
            Gestisci tutti gli eventi di FantaMiccio.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          + Nuovo evento
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Titolo</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Stagione</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Stato</th>
              <th className="p-3 text-center">Azioni</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Caricamento...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Nessun evento presente.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.event_type}</td>
                  <td className="p-3">{event.season}</td>
                  <td className="p-3">
                    {new Date(event.event_date).toLocaleDateString("it-IT")}
                  </td>
                  <td className="p-3">{event.status}</td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Modifica
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
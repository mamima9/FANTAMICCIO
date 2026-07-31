"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  season: number;
  event_date: string;
  prediction_deadline: string | null;
  status: string;
};

export default function EditEventPage() {
  const supabase = createClient();
  const params = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
      }

      if (data) {
        setEvent(data);
      }

      setLoading(false);
    }

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

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
    <main className="max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">✏️ Modifica Evento</h1>

      <div className="space-y-3 rounded-lg border p-6">
        <p><strong>Titolo:</strong> {event.title}</p>
        <p><strong>Tipo:</strong> {event.event_type}</p>
        <p><strong>Stagione:</strong> {event.season}</p>
        <p><strong>Data:</strong> {event.event_date}</p>
        <p><strong>Stato:</strong> {event.status}</p>
      </div>
    </main>
  );
}
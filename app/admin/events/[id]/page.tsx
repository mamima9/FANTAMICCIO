"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EventForm = {
  title: string;
  description: string;
  event_type: string;
  season: number;
  event_date: string;
  prediction_deadline: string;
  status: string;
};

type EventType = {
  id: string;
  name: string;
  slug: string;
};

export default function EditEventPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    event_type: "",
    season: new Date().getFullYear(),
    event_date: "",
    prediction_deadline: "",
    status: "DRAFT",
  });

  useEffect(() => {
    async function loadData() {
      const [{ data: types }, { data: event, error }] = await Promise.all([
        supabase
          .from("event_types")
          .select("id, name, slug")
          .order("name"),

        supabase
          .from("events")
          .select("*")
          .eq("id", params.id)
          .single(),
      ]);

      if (types) {
        setEventTypes(types);
      }

      if (error || !event) {
        console.error(error);
        alert("Evento non trovato.");
        setLoading(false);
        return;
      }

      setForm({
        title: event.title ?? "",
        description: event.description ?? "",
        event_type: event.event_type ?? "",
        season: event.season ?? new Date().getFullYear(),
        event_date: event.event_date ?? "",
        prediction_deadline: event.prediction_deadline
          ? String(event.prediction_deadline).slice(0, 16)
          : "",
        status: event.status ?? "DRAFT",
      });

      setLoading(false);
    }

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("events")
      .update({
        title: form.title,
        description: form.description,
        event_type: form.event_type,
        season: Number(form.season),
        event_date: form.event_date,
        prediction_deadline: form.prediction_deadline || null,
        status: form.status,
      })
      .eq("id", params.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Errore durante il salvataggio.");
      return;
    }

    alert("Evento aggiornato con successo!");
  }



async function handleDelete() {
  if (!confirm("Sei sicuro di voler eliminare questo evento?")) {
    return;
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error(error);
    alert("Errore durante l'eliminazione.");
    return;
  }

  alert("Evento eliminato.");

  router.push("/admin/events");
}

  if (loading) {
    return (
      <main className="p-8">
        <p>Caricamento...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        ✏️ Modifica Evento
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
                <div>
          <label className="mb-1 block">Titolo</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Descrizione</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded border p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block">Tipo evento</label>

          <select
            name="event_type"
            value={form.event_type}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="">Seleziona un tipo di evento</option>

            {eventTypes.map((type) => (
              <option key={type.id} value={type.slug}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block">Stagione</label>

          <input
            type="number"
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Data evento</label>

          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Scadenza pronostici</label>

          <input
            type="datetime-local"
            name="prediction_deadline"
            value={form.prediction_deadline}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Stato</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded border p-2"
          >
            <option>DRAFT</option>
            <option>OPEN</option>
            <option>CLOSED</option>
            <option>RESULT_PUBLISHED</option>
            <option>COMPLETED</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
            <button
  type="button"
  onClick={handleDelete}
  className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700"
>
  Elimina evento
</button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-amber-600 px-5 py-2 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </button>
        </div>
      </form>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewEventPage() {
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "",
    season: new Date().getFullYear(),
    event_date: "",
    prediction_deadline: "",
    status: "DRAFT",
  });

  const [eventTypes, setEventTypes] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  useEffect(() => {
    async function loadEventTypes() {
      const { data, error } = await supabase
        .from("event_types")
        .select("id, name, slug")
        .order("name");

      if (!error && data) {
        setEventTypes(data);
      }
    }

    loadEventTypes();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert("Per ora il form funziona! Nel prossimo passo lo collegheremo a Supabase.");
  }

  return (
    <main className="max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">➕ Nuovo Evento</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

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

        {/* Questo lo cambieremo nel prossimo passo */}

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

        <button
          type="submit"
          className="rounded bg-amber-600 px-5 py-2 text-white hover:bg-amber-700"
        >
          Salva evento
        </button>

      </form>
    </main>
  );
}
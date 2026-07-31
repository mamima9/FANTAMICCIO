"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Contrada = {
  id: number;
  name: string;
};

export default function ResultPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [contrade, setContrade] = useState<Contrada[]>([]);

  const [form, setForm] = useState({
    winner_contrada_id: "",
    second_contrada_id: "",
    third_contrada_id: "",
    results_published: false,
  });

  useEffect(() => {
    async function loadData() {
      const [{ data: contrade }, { data: event, error }] =
        await Promise.all([
          supabase
            .from("Contrade")
            .select("id, name")
            .order("nome"),

          supabase
            .from("events")
            .select(
              "winner_contrada_id, second_contrada_id, third_contrada_id, results_published"
            )
            .eq("id", params.id)
            .single(),
        ]);

      if (contrade) {
        setContrade(contrade);
      }

      if (error) {
        console.error(error);
        alert("Evento non trovato.");
        setLoading(false);
        return;
      }

      setForm({
        winner_contrada_id: event?.winner_contrada_id?.toString() ?? "",
        second_contrada_id: event?.second_contrada_id?.toString() ?? "",
        third_contrada_id: event?.third_contrada_id?.toString() ?? "",
        results_published: event?.results_published ?? false,
      });

      setLoading(false);
    }

    loadData();
  }, []);

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
      🏁 Inserisci risultati
    </h1>

    <div className="space-y-5">

      <div>
        <label className="mb-1 block font-medium">
          🥇 Vincitore
        </label>

        <select
          className="w-full rounded border p-2"
          value={form.winner_contrada_id}
          onChange={(e) =>
            setForm({
              ...form,
              winner_contrada_id: e.target.value,
            })
          }
        >
          <option value="">Seleziona...</option>

          {contrade.map((contrada) => (
            <option key={contrada.id} value={contrada.id}>
              {contrada.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          🥈 Secondo
        </label>

        <select
          className="w-full rounded border p-2"
          value={form.second_contrada_id}
          onChange={(e) =>
            setForm({
              ...form,
              second_contrada_id: e.target.value,
            })
          }
        >
          <option value="">Seleziona...</option>

          {contrade.map((contrada) => (
            <option key={contrada.id} value={contrada.id}>
              {contrada.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          🥉 Terzo
        </label>

        <select
          className="w-full rounded border p-2"
          value={form.third_contrada_id}
          onChange={(e) =>
            setForm({
              ...form,
              third_contrada_id: e.target.value,
            })
          }
        >
          <option value="">Seleziona...</option>

          {contrade.map((contrada) => (
            <option key={contrada.id} value={contrada.id}>
              {contrada.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={form.results_published}
          onChange={(e) =>
            setForm({
              ...form,
              results_published: e.target.checked,
            })
          }
        />

        <label htmlFor="published">
          Pubblica risultati
        </label>
      </div>

      <button
        className="rounded bg-amber-600 px-5 py-2 text-white hover:bg-amber-700"
      >
        Salva risultati
      </button>

    </div>
  </main>
);
}
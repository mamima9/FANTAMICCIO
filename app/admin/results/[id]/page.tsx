"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Contrada = {
  id: number;
  nome: string;
};

export default function ResultPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [contrade, setContrade] = useState<Contrada[]>([]);

  const [form, setForm] = useState({
    winner_contrada_id: "",
    second_contrada_id: "",
    third_contrada_id: "",
    results_published: false,
  });

  useEffect(() => {
    async function loadData() {
      const [
        { data: contrade, error: contradeError },
        { data: event, error: eventError },
      ] = await Promise.all([
        supabase
          .from("Contrade")
          .select("id, nome")
          .order("nome"),

        supabase
          .from("events")
          .select(
            "winner_contrada_id, second_contrada_id, third_contrada_id, results_published"
          )
          .eq("id", params.id as string)
          .single(),
      ]);

      if (contradeError) {
        console.error(contradeError);
      }

      if (contrade) {
        setContrade(contrade);
      }

      if (eventError) {
        console.error(eventError);
        alert("Evento non trovato.");
        setLoading(false);
        return;
      }

      setForm({
        winner_contrada_id:
          event?.winner_contrada_id?.toString() ?? "",
        second_contrada_id:
          event?.second_contrada_id?.toString() ?? "",
        third_contrada_id:
          event?.third_contrada_id?.toString() ?? "",
        results_published:
          event?.results_published ?? false,
      });

      setLoading(false);
    }

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("events")
      .update({
        winner_contrada_id:
          form.winner_contrada_id === ""
            ? null
            : Number(form.winner_contrada_id),

        second_contrada_id:
          form.second_contrada_id === ""
            ? null
            : Number(form.second_contrada_id),

        third_contrada_id:
          form.third_contrada_id === ""
            ? null
            : Number(form.third_contrada_id),

        results_published:
          form.results_published,
      })
      .eq("id", params.id as string);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Errore durante il salvataggio.");
      return;
    }

    alert("Risultati salvati con successo!");

    router.push("/admin/results");
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
              <option
                key={contrada.id}
                value={contrada.id}
              >
                {contrada.nome}
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
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-amber-600 px-5 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva risultati"}
        </button>

      </div>
    </main>
  );
}
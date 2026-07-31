import { createClient } from "@/lib/supabase/client";

export async function calculatePoints(eventId: string) {
  const supabase = createClient();

  // Risultato ufficiale
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select(
      "winner_contrada_id, second_contrada_id, third_contrada_id"
    )
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    throw new Error("Evento non trovato.");
  }

  // Tutti i pronostici
  const { data: predictions, error: predictionsError } =
    await supabase
      .from("predictions")
      .select("id, prediction")
      .eq("event_id", eventId);

  if (predictionsError) {
    throw new Error("Errore nel caricamento dei pronostici.");
  }

  let updated = 0;

  for (const row of predictions ?? []) {
    const prediction = row.prediction as {
      winner?: number;
      second?: number;
      third?: number;
    };

    let points = 0;

    if (prediction?.winner === event.winner_contrada_id) {
      points += 100;
    }

    if (prediction?.second === event.second_contrada_id) {
      points += 60;
    }

    if (prediction?.third === event.third_contrada_id) {
      points += 30;
    }
        const { error: updateError } = await supabase
      .from("predictions")
      .update({
        points_awarded: points,
      })
      .eq("id", row.id);

    if (updateError) {
      console.error(updateError);
      continue;
    }

    updated++;
  }

  return updated;
}
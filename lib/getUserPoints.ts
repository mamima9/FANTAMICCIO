import { createClient } from "@/lib/supabase/client";

export async function getUserPoints() {
  const supabase = createClient();

  // Recupera utente loggato
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  // Recupera tutti i suoi pronostici con punti
  const { data, error } = await supabase
    .from("predictions")
    .select("points_awarded")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return 0;
  }

  // Somma punti
  const total = (data ?? []).reduce(
    (sum, prediction) =>
      sum + (prediction.points_awarded ?? 0),
    0
  );

  return total;
}
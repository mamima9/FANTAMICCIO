import { createClient } from "@/lib/supabase/client";

export async function checkAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return false;
  }

  return profile?.role === "admin";
}
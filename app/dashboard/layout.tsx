import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Controlla autenticazione
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Recupera il profilo
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, avatar, contrada_id")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  // Dati dell'utente per la Dashboard
  const dashboardUser = {
    username: profile.username,
    avatar: profile.avatar,
    contrada_id: profile.contrada_id,
  };

  return (
    <>
      <DashboardNavbar user={dashboardUser} />

      <main className="min-h-[calc(100vh-64px)] bg-stone-100">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </>
  );
}
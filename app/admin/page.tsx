import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Admin FantaMiccio</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <Link
          href="/admin/events"
          className="rounded-xl border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">📅 Eventi</h2>
          <p className="text-gray-500">
            Gestisci gli eventi del Palio.
          </p>
        </Link>

        <Link
          href="/admin/results"
          className="rounded-xl border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">🏁 Risultati</h2>
          <p className="text-gray-500">
            Inserisci e pubblica i risultati ufficiali.
          </p>
        </Link>

        <div className="rounded-xl border p-6 opacity-50">
          <h2 className="text-xl font-semibold">⚡ Calcolo punti</h2>
          <p className="text-gray-500">
            Prossimamente
          </p>
        </div>

      </div>
    </main>
  );
}
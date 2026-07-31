export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Admin FantaMiccio</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <a
          href="/admin/events"
          className="rounded-xl border p-6 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">📅 Eventi</h2>
          <p className="text-gray-500">
            Gestisci gli eventi del Palio.
          </p>
        </a>

        <div className="rounded-xl border p-6 opacity-50">
          🏁 Risultati
          <br />
          <small>Prossimamente</small>
        </div>

        <div className="rounded-xl border p-6 opacity-50">
          ⚡ Calcolo punti
          <br />
          <small>Prossimamente</small>
        </div>
      </div>
    </main>
  );
}
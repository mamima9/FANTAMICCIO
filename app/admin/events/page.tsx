import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📅 Eventi</h1>
          <p className="text-gray-500">
            Gestisci tutti gli eventi di FantaMiccio.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          + Nuovo evento
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Titolo</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Stagione</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Stato</th>
              <th className="p-3 text-center">Azioni</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-gray-500"
              >
                Nessun evento presente.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
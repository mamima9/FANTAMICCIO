export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#5C3A21]">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Benvenuto su FantaMiccio!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">🏆 I miei punti</h2>
          <p className="mt-3 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">👥 La mia squadra</h2>
          <p className="mt-3 text-gray-600">
            Nessuna squadra creata
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">📰 Ultime news</h2>
          <p className="mt-3 text-gray-600">
            Nessuna news disponibile
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">📈 Classifica</h2>
          <p className="mt-3 text-gray-600">
            In arrivo...
          </p>
        </div>
      </div>
    </div>
  );
}
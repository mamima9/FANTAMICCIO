import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          FantaMiccio
        </Link>

        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/contrade">Contrade</Link>
          <Link href="/classifica">Classifiche</Link>
          <Link href="/news">News</Link>
        </nav>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Accedi
        </Link>

      </div>
    </header>
  );
}
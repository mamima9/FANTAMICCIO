export default function Footer() {
  return (
    <footer className="bg-[#2B1B12] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Logo */}
        <div>
          <h3 className="text-2xl font-bold">FantaMiccio</h3>
          <p className="mt-3 text-gray-300">
            Il Fantasy Game dedicato al Palio dei Micci di Querceta.
          </p>
        </div>

        {/* Link */}
        <div>
          <h4 className="font-semibold mb-3">Navigazione</h4>
          <ul className="space-y-2">
            <li><a href="/">Home</a></li>
            <li><a href="/palio-dei-micci">Il Palio</a></li>
            <li><a href="/contrade">Contrade</a></li>
            <li><a href="/albi-doro">Albi d'Oro</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Seguici</h4>

        <a
  href="https://instagram.com/fantamiccio"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-pink-400 transition"
>
  📷 Instagram
</a>
        </div>

      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
        © 2026 FantaMiccio • Tutti i diritti riservati.
      </div>
    </footer>
  );
}
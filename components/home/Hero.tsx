import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#F8F5F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">

        <Image
          src="/contrade/logo.png"
          alt="FantaMiccio"
          width={220}
          height={220}
          priority
        />

        <h1 className="mt-8 text-6xl font-extrabold text-[#5C3A21]">
          FantaMiccio
        </h1>

        <p className="mt-4 text-2xl text-gray-700 max-w-2xl">
          Il Fantasy Game del Palio dei Micci
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">

          <Link
            href="/registrazione"
            className="bg-[#D4AF37] text-[#5C3A21] px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition"
          >
            Gioca Ora
          </Link>

          <Link
            href="#scopri"
            className="border-2 border-[#5C3A21] text-[#5C3A21] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#5C3A21] hover:text-white transition"
          >
            Scopri di più
          </Link>

        </div>

      </div>
    </section>
  );
}
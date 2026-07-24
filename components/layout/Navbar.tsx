"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#5C3A21]/95 backdrop-blur border-b border-[#D4AF37]/20 shadow">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/contrade/logo.png"
            alt="FantaMiccio"
            width={48}
            height={48}
          />

          <span className="text-2xl font-bold text-[#D4AF37]">
            FantaMiccio
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-8 font-medium">

          <Link href="/" className="text-white hover:text-[#D4AF37] transition">
            Home
          </Link>

          <Link href="/contrade" className="text-white hover:text-[#D4AF37] transition">
            Contrade
          </Link>

          <Link href="/classifica" className="text-white hover:text-[#D4AF37] transition">
            Classifiche
          </Link>

          <Link href="/news" className="text-white hover:text-[#D4AF37] transition">
            News
          </Link>

        </nav>

        {/* Desktop button */}
        <Link
          href="/login"
          className="hidden lg:block bg-[#D4AF37] text-[#5C3A21] font-semibold px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          Accedi
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={30}/> : <Menu size={30}/>}
        </button>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#5C3A21] border-t border-[#D4AF37]/20">

          <Link href="/" className="block px-6 py-4 text-white">Home</Link>

          <Link href="/contrade" className="block px-6 py-4 text-white">Contrade</Link>

          <Link href="/classifica" className="block px-6 py-4 text-white">Classifiche</Link>

          <Link href="/news" className="block px-6 py-4 text-white">News</Link>

          <Link
            href="/login"
            className="block m-4 text-center bg-[#D4AF37] text-[#5C3A21] py-3 rounded-xl font-bold"
          >
            Accedi
          </Link>

        </div>
      )}

    </header>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  // DATA DEL PALIO (modificala quando vuoi)
  const targetDate = new Date("2027-05-02T15:30:00");

  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-amber-900 to-yellow-700 p-10 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black">
            🏇 IL PALIO DEI MICCI È IN CORSO!
          </h2>
        </div>
      </section>
    );
  }

  const Item = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex w-24 flex-col items-center rounded-2xl bg-white/10 p-5 backdrop-blur">
      <span className="text-5xl font-black text-[#FFD76A]">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-2 text-sm uppercase tracking-widest text-white/80">
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#4B2E1F] via-[#6B4226] to-[#8C5A2B] p-12 text-center shadow-2xl">

        <p className="mb-3 text-lg uppercase tracking-[0.35em] text-[#FFD76A]">
          Il conto alla rovescia è iniziato
        </p>

        <h2 className="mb-10 text-5xl font-black text-white">
          ⏳ MANCANO AL PALIO DEI MICCI
        </h2>

        <div className="flex flex-wrap justify-center gap-6">

          <Item value={timeLeft.days} label="Giorni" />

          <Item value={timeLeft.hours} label="Ore" />

          <Item value={timeLeft.minutes} label="Minuti" />

          <Item value={timeLeft.seconds} label="Secondi" />

        </div>
      </div>
    </section>
  );
}
import Image from "next/image";

const contrade = [
  { nome: "La Cervia", stemma: "/contrade/cervia.png" },
  { nome: "Leon d'Oro", stemma: "/contrade/leondoro.png" },
  { nome: "La Lucertola", stemma: "/contrade/lucertola.png" },
  { nome: "La Madonnina", stemma: "/contrade/madonnina.png" },
  { nome: "Il Ponte", stemma: "/contrade/ponte.png" },
  { nome: "Il Pozzo", stemma: "/contrade/pozzo.png" },
  { nome: "La Quercia", stemma: "/contrade/quercia.png" },
  { nome: "Il Ranocchio", stemma: "/contrade/ranocchio.png" },
];

export default function Contrade() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#5C3A21] mb-12">
          Le Contrade
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {contrade.map((contrada) => (
            <div
              key={contrada.nome}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center"
            >
              <Image
                src={contrada.stemma}
                alt={contrada.nome}
                width={110}
                height={110}
              />

              <h3 className="mt-4 font-bold text-lg text-[#5C3A21] text-center">
                {contrada.nome}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
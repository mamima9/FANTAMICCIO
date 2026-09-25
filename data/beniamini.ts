export type Beniamino = {
  id: string;
  nome: string;
  contradaId: string;
  image: string;
  tipo: "mappa" | "scambio";
};

export const BENIAMINI: Beniamino[] = [
  {
    id: "cervia",
    nome: "Cervia",
    contradaId: "1",
    image: "/account/cervia.png",
    tipo: "mappa",
  },

  {
    id: "leondoro",
    nome: "Leon d'Oro",
    contradaId: "2",
    image: "/account/leondoro.png",
    tipo: "mappa",
  },

  {
    id: "lucertola",
    nome: "Lucertola",
    contradaId: "3",
    image: "/account/lucertola.jpg",
    tipo: "mappa",
  },

  {
    id: "madonnina",
    nome: "Madonnina",
    contradaId: "4",
    image: "/account/madonnina.jpg",
    tipo: "mappa",
  },

  {
    id: "ponte",
    nome: "Ponte",
    contradaId: "5",
    image: "/account/ponte.jpg",
    tipo: "mappa",
  },

  {
    id: "pozzo",
    nome: "Pozzo",
    contradaId: "6",
    image: "/account/pozzozz.png",
    tipo: "mappa",
  },

  {
    id: "quercia",
    nome: "Quercia",
    contradaId: "7",
    image: "/account/quercia.png",
    tipo: "mappa",
  },

  {
    id: "ranocchio",
    nome: "Ranocchio",
    contradaId: "8",
    image: "/account/ranocchi.png",
    tipo: "mappa",
  },

  {
    id: "barone",
    nome: "Barone",
    contradaId: "speciale",
    image: "/account/barone.png",
    tipo: "scambio",
  },
];
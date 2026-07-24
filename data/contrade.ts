export interface Contrada {
  id: string;
  nome: string;
  stemma: string;
  colore: string;
}

export const contrade: Contrada[] = [
  {
    id: "cervia",
    nome: "La Cervia",
    stemma: "/contrade/cervia.png",
    colore: "#0B6CB8",
  },
  {
    id: "leondoro",
    nome: "Il Leon d'Oro",
    stemma: "/contrade/leondoro.png",
    colore: "#D4AF37",
  },
  {
    id: "lucertola",
    nome: "La Lucertola",
    stemma: "/contrade/lucertola.png",
    colore: "#2E8B57",
  },
  {
    id: "madonnina",
    nome: "La Madonnina",
    stemma: "/contrade/madonnina.png",
    colore: "#E53935",
  },
  {
    id: "ponte",
    nome: "Il Ponte",
    stemma: "/contrade/ponte.png",
    colore: "#8E24AA",
  },
  {
    id: "pozzo",
    nome: "Il Pozzo",
    stemma: "/contrade/pozzo.png",
    colore: "#1565C0",
  },
  {
    id: "quercia",
    nome: "La Quercia",
    stemma: "/contrade/quercia.png",
    colore: "#2E7D32",
  },
  {
    id: "ranocchio",
    nome: "Il Ranocchio",
    stemma: "/contrade/ranocchio.png",
    colore: "#43A047",
  },
];
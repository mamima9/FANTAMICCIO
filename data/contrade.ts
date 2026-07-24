export interface Contrada {
  id: string;
  nome: string;
  stemma: string;
  colori: {
    primario: string;
    secondario: string;
    terziario?: string;
  };
}

export const contrade: Contrada[] = [
  {
    id: "cervia",
    nome: "La Cervia",
    stemma: "/contrade/cervia.png",
    colori: {
      primario: "#FFFFFF", // Bianco
      secondario: "#7EC8E3", // Celeste
    },
  },
  {
    id: "leondoro",
    nome: "Leon d'Oro",
    stemma: "/contrade/leondoro.png",
    colori: {
      primario: "#FFD700", // Giallo
      secondario: "#D32F2F", // Rosso
      terziario: "#1565C0", // Blu
    },
  },
  {
    id: "lucertola",
    nome: "La Lucertola",
    stemma: "/contrade/lucertola.png",
    colori: {
      primario: "#D32F2F", // Rosso
      secondario: "#2E7D32", // Verde
      terziario: "#FFD700", // Giallo
    },
  },
  {
    id: "madonnina",
    nome: "La Madonnina",
    stemma: "/contrade/madonnina.png",
    colori: {
      primario: "#1565C0", // Blu
      secondario: "#FFD700", // Giallo
      terziario: "#D32F2F", // Rosso
    },
  },
  {
    id: "ponte",
    nome: "Il Ponte",
    stemma: "/contrade/ponte.png",
    colori: {
      primario: "#D32F2F", // Rosso
      secondario: "#1565C0", // Blu
      terziario: "#FFD700", // Giallo
    },
  },
  {
    id: "pozzo",
    nome: "Il Pozzo",
    stemma: "/contrade/pozzo.png",
    colori: {
      primario: "#FFFFFF", // Bianco
      secondario: "#D32F2F", // Rosso
      terziario: "#1565C0", // Blu
    },
  },
  {
    id: "quercia",
    nome: "La Quercia",
    stemma: "/contrade/quercia.png",
    colori: {
      primario: "#FFFFFF", // Bianco
      secondario: "#000000", // Nero
      terziario: "#F57C00", // Arancione
    },
  },
  {
    id: "ranocchio",
    nome: "Il Ranocchio",
    stemma: "/contrade/ranocchio.png",
    colori: {
      primario: "#FFD700", // Giallo
      secondario: "#2E7D32", // Verde
      terziario: "#FFFFFF", // Bianco
    },
  },
];
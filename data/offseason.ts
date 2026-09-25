export type Coordinates = [number, number];

export type OffSeasonBeniamino = {
  id: string;
  nome: string;
  image: string;
  coordinates: Coordinates;
  hint: string;
};

export type OffSeasonNpc = {
  id: string;
  nome: string;
  coordinates: Coordinates;
  text: string;
  clue: string;
};

export const MAP_CENTER: Coordinates = [43.9765, 10.2035];

export const BENIAMINI_MAPPA: OffSeasonBeniamino[] = [
  {
    id: "cervia",
    nome: "Cervia",
    image: "/account/cervia.png",
    coordinates: [43.95773, 10.22506],
    hint: "Cerca nella zona della Cervia.",
  },
  {
    id: "leondoro",
    nome: "Leon d'Oro",
    image: "/account/leondoro.png",
    coordinates: [43.98086, 10.20304],
    hint: "Segui gli indizi verso Marzocchino.",
  },
  {
    id: "lucertola",
    nome: "Lucertola",
    image: "/account/lucertola.jpg",
    coordinates: [43.98458, 10.21372],
    hint: "Gli indizi portano verso Ripa.",
  },
  {
    id: "madonnina",
    nome: "Madonnina",
    image: "/account/madonnina.jpg",
    coordinates: [43.97315, 10.20749],
    hint: "Cerca verso la Madonnina dei Pagliai.",
  },
  {
    id: "ponte",
    nome: "Ponte",
    image: "/account/ponte.jpg",
    coordinates: [43.96688, 10.19238],
    hint: "Segui la strada verso Ponte e Vaiana.",
  },
  {
    id: "pozzo",
    nome: "Pozzo",
    image: "/account/pozzozz.png",
    coordinates: [43.9769, 10.2152],
    hint: "Cerca nella zona di Pozzi.",
  },
  {
    id: "quercia",
    nome: "Quercia",
    image: "/account/quercia.png",
    coordinates: [43.97659, 10.20043],
    hint: "Il centro di Querceta nasconde qualcosa.",
  },
  {
    id: "ranocchio",
    nome: "Ranocchio",
    image: "/account/ranocchi.png",
    coordinates: [43.97924, 10.19747],
    hint: "Gli indizi conducono verso Cugnia.",
  },
];

export const NPCS: OffSeasonNpc[] = [
  {
    id: "vecchio-contradaiolo",
    nome: "Il Vecchio Contradaiolo",
    coordinates: [43.9767, 10.2004],
    text:
      "Qui il Palio dei Micci vive da generazioni. Ogni Contrada custodisce la propria storia.",
    clue:
      "La prima traccia è vicina al cuore di Querceta.",
  },

  {
    id: "contadino-ranocchio",
    nome: "Il Contadino del Ranocchio",
    coordinates: [43.9792, 10.1975],
    text:
      "Dalle parti del Ranocchio si respira ancora il legame con il territorio.",
    clue:
      "Segui il sentiero verso la zona del Ranocchio.",
  },

  {
    id: "storico-leon",
    nome: "Lo Storico di Marzocchino",
    coordinates: [43.9808, 10.203],
    text:
      "Il Leon d'Oro affonda le proprie radici nella zona di Marzocchino.",
    clue:
      "La prossima traccia guarda verso le colline.",
  },

  {
    id: "custode-madonnina",
    nome: "La Custode della Madonnina",
    coordinates: [43.9732, 10.2075],
    text:
      "La Madonnina prende il nome dalla cappella dei Pagliai.",
    clue:
      "Cerca dove la storia incontra la campagna.",
  },

  {
    id: "viandante-cervia",
    nome: "Il Viandante della Cervia",
    coordinates: [43.9577, 10.225],
    text:
      "La Cervia guarda la pianura ai piedi delle colline.",
    clue:
      "Una nuova traccia ti aspetta verso Ripa.",
  },

  {
    id: "abitante-ripa",
    nome: "L'Abitante di Ripa",
    coordinates: [43.9846, 10.2137],
    text:
      "Ripa è legata alla storia della Lucertola.",
    clue:
      "Il prossimo indizio segue la strada verso il Ponte.",
  },

  {
    id: "guardiano-ponte",
    nome: "Il Guardiano del Ponte",
    coordinates: [43.9669, 10.1924],
    text:
      "Il Ponte è una delle Contrade storiche del Palio.",
    clue:
      "L'ultima traccia ti riporta verso Pozzi.",
  },

  {
    id: "guardiano-pozzi",
    nome: "Il Guardiano di Pozzi",
    coordinates: [43.9769, 10.2152],
    text:
      "Il Pozzo custodisce l'ultima parte del percorso.",
    clue:
      "Hai quasi completato la Tregua. Trova il Beniamino.",
  },
];
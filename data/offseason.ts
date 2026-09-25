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

export const NPCS:OffSeasonNpc[]=[
{id:"vecchio-contradaiolo",nome:"Il Vecchio Contradaiolo",coordinates:[43.9767,10.2004],text:"La prima edizione del Palio dei Micci si disputò a Querceta il 18 marzo 1956. Tra le prime Contrade c'erano Lucertola, Ponte, Quercia, Pozzo, Leon d'Oro e Ranocchio.",clue:"Ricorda questo numero: sei Contrade furono presenti fin dall'inizio. Cerca il Beniamino nel cuore di Querceta."},
{id:"contadino-ranocchio",nome:"Il Contadino del Ranocchio",coordinates:[43.9792,10.1975],text:"Il Ranocchio fu tra le rappresentanze presenti alla prima edizione del 1956. Da allora le Contrade sono diventate il cuore della vita sociale e popolare della piana quercetana.",clue:"La storia più antica ti porta verso una delle otto zone nate dal primo Palio."},
{id:"storico-leon",nome:"Lo Storico di Marzocchino",coordinates:[43.9808,10.203],text:"Il Leon d'Oro appartiene al gruppo delle Contrade presenti fin dalla prima edizione del 18 marzo 1956.",clue:"Se cerchi una delle radici del Palio, guarda verso la zona del Leon d'Oro."},
{id:"custode-madonnina",nome:"La Custode della Madonnina",coordinates:[43.9732,10.2075],text:"La Madonnina non era ancora presente alla prima edizione: iniziò a gareggiare dall'edizione del 1957.",clue:"La sua storia comincia un anno dopo il primo Palio. Cerca il Beniamino nella sua zona."},
{id:"viandante-cervia",nome:"Il Viandante della Cervia",coordinates:[43.9577,10.225],text:"La Cervia fu fondata successivamente e partecipò per la prima volta al Palio nel 1958.",clue:"È l'ultima delle otto a entrare nella storia del Palio. Segui gli indizi verso la sua zona."},
{id:"abitante-ripa",nome:"L'Abitante di Ripa",coordinates:[43.9846,10.2137],text:"La Lucertola era già tra le rappresentanze della prima edizione del 1956. Da allora l'identità delle Contrade si è tramandata attraverso generazioni.",clue:"Torna alle origini: cerca una delle Contrade che erano già presenti nel 1956."},
{id:"guardiano-ponte",nome:"Il Guardiano del Ponte",coordinates:[43.9669,10.1924],text:"Il Ponte fu tra le Contrade presenti alla prima edizione del Palio, nel pomeriggio di domenica 18 marzo 1956.",clue:"La traccia viene dagli inizi. Cerca il Beniamino vicino alla zona del Ponte."},
{id:"guardiano-pozzi",nome:"Il Guardiano di Pozzi",coordinates:[43.9769,10.2152],text:"Il Pozzo appartiene al gruppo delle sei Contrade presenti alla prima edizione del 1956.",clue:"Sei Contrade erano già al via nel 1956. Hai quasi completato la Tregua: trova il Beniamino."}
];

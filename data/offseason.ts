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
  // LA CERVIA
  {id:"cervia-archivista",mapId:"cervia",nome:"L'Archivista di Porta Beltrame",position:[6,6],text:"Le prime memorie di Porta Beltrame risalgono al 15 maggio 1055: un decreto di Arrigo III a favore del Vescovo di Luni cita queste terre legate al Castello Aghinolfi. La storia della Cervia affonda quindi molto più indietro del periodo che la Contrada rievoca nel Palio.",clue:"Segui la traccia verso la Cugnìa: la prossima storia parla di un podere fortificato e di quattro case."},
  {id:"cervia-cugnia",mapId:"cervia",nome:"Il Contadino della Cugnìa",position:[12,10],text:"Nel 1368 una vendita di parte del Lago di Porta ad Alderigo di Franceschino Interminelli cita un podere con corte murata e quattro case di contadini alla Cugnìa. Porta Beltrame, chiamata anche Salto della Cervia, insieme al Frasso apparteneva all'antico territorio della Contrada.",clue:"Cerca Santa Maria di Porta: un antico oratorio racconta un altro capitolo della storia."},
  {id:"cervia-custode",mapId:"cervia",nome:"Il Custode di Santa Maria",position:[20,7],text:"Nel 1377 fu costruito l'antico Oratorio di Santa Maria di Porta. In seguito Luccani e Fiorentini fortificarono la zona e la cappella fu ricostruita dai Fiorentini. L'ultima testimonianza della scultura legata a quel luogo è conservata sotto il portico della Chiesa della Santissima Annunziata di Seravezza.",clue:"La posizione strategica della Cervia portò anche a nuove fortificazioni. Cerca la torre."},
  {id:"cervia-torre",mapId:"cervia",nome:"Il Vecchio della Torre",position:[25,13],text:"Nel 1395 Luccani e Fiorentini, alleati contro le compagnie di ventura, fortificarono il luogo. In seguito Donamelo Beni progettò una torre difensiva. Altre fortificazioni sorsero per la posizione strategica del passaggio: i resti sono ricordati come Torre Medicea, ancora visibile lungo la Via Aurelia al confine tra le province di Lucca e Massa-Carrara.",clue:"Ora ascolta la storia che ha dato alla Contrada il suo simbolo: parla di una cerva e di un tabernacolo."},
  {id:"cervia-cerva",mapId:"cervia",nome:"Il Cacciatore Pentito",position:[10,17],text:"La tradizione racconta che una cerva si rifugiò nell'antico tabernacolo di Santa Maria di Porta per sfuggire a un cacciatore che aveva rivolto parole irriverenti contro l'immagine sacra. L'animale fuggì con un agile salto verso il monte e, secondo il racconto, lasciò per lungo tempo impronte degli zoccoli nella roccia. Da questa tradizione nasce il simbolo della Cervia.",clue:"La cerva accompagna la Contrada da secoli. Cerca chi ti racconterà della Cervia di oggi."},
  {id:"cervia-oggi",mapId:"cervia",nome:"La Contradaiola di Montiscendi",position:[22,19],text:"Il territorio storico della Cervia è rimasto in gran parte riconoscibile, anche se la popolazione è cresciuta. Il simbolo della cerva vive da oltre seicento anni. I colori sono bianco e celeste, legati alla sua antica appartenenza a Pietrasanta, e i costumi del Palio si ispirano al periodo 1350-1450. La sede della Contrada si trova nell'ex edificio delle scuole elementari ristrutturato, in Via Aurelia a Montiscendi, all'ingresso nord di Querceta.",clue:"Hai ricostruito la storia della Cervia. Il Beniamino è nascosto nella sua terra."},

  // LEON D'ORO
  {id:"leon-archeologo",mapId:"leondoro",nome:"L'Archeologo di Baraglino",position:[6,6],text:"Nel territorio del Leon d'Oro, tra Marzocchino, Cafaggio e Baraglino, sono emersi importanti reperti. Intorno al 1880 a Baraglino fu scavata una necropoli etrusca. I corredi di una tomba furono pubblicati da Neppi Modona nel 1932 e alcuni oggetti sono oggi al Museo Nazionale di Pisa.",clue:"La necropoli nasconde un nome inciso nel bucchero. Cerca chi studia i cippi."},
  {id:"leon-cippi",mapId:"leondoro",nome:"Il Custode dei Cippi",position:[13,9],text:"Nel territorio del Leon d'Oro, oltre che a Pozzi e Strettoia, furono trovati sei grandi cippi funerari in marmo, alti fino a 1,8 metri. Hanno forma troncoconica e una caratteristica ispirazione fallica: sono esempi di scultura funeraria etrusca arcaica databili alla prima metà del I millennio a.C.",clue:"Torna a Baraglino: nel corredo di una tomba c'era anche un'iscrizione misteriosa."},
  {id:"leon-milarthurus",mapId:"leondoro",nome:"Il Lettore di Milarthurus",position:[20,6],text:"Tra i reperti di una tomba di Baraglino comparvero una ciotola, un ossuario troncoconico, un coperchio di ciotola e un frammento di calice, tutti in bucchero nero. Su uno degli oggetti compariva l'iscrizione etrusca «Milarthurus». Altri ritrovamenti sono emersi anche presso una villa di Cafaggio.",clue:"La storia continua con i signori medievali e con un antico oratorio di Cafaggio."},
  {id:"leon-cafaggio",mapId:"leondoro",nome:"Il Vecchio di Cafaggio",position:[25,11],text:"Nei secoli successivi Marzocchino e Cafaggio furono legati ai Toparchi della Versilia, signori di Querceta. Secondo Santini, stime del 1377 e del 1416 citano l'Oratorio di Sant'Andrea alla Bonazzera, a Cafaggio.",clue:"Segui la strada del marmo: Marzocchino conserva un legame con Michelangelo e con la corte medicea."},
  {id:"leon-marmista",mapId:"leondoro",nome:"Il Marmista di Marzocchino",position:[10,17],text:"Marzocchino fu attraversato dalla Via dei Marmi progettata da Michelangelo Buonarroti. La strada rafforzò il legame della zona con la corte dei Medici e con l'estrazione del marmo delle Apuane.",clue:"Ora ascolta la tradizione sull'arrivo di Ferdinando I de' Medici."},
  {id:"leon-medici",mapId:"leondoro",nome:"Il Cantastorie dei Medici",position:[21,19],text:"Nel 1592 Ferdinando I de' Medici e la Granduchessa Cristina di Lorena arrivarono per la prima volta a prendere possesso delle terre di Seravezza. La tradizione racconta che si fermarono a Marzocchino, colpiti dalle Apuane, dalle cave di marmo, dagli oliveti e dalla campagna versiliese, e che tornarono più volte durante il loro regno. Il riferimento mediceo vive anche nel nome della Contrada. Il Leon d'Oro ospitò inoltre le prime due edizioni del Palio, nel 1956 e 1957, con le corse in Via delle Catene su un campo della Chiesa di Ripa. I colori sono giallo e rosso e i costumi rievocano il periodo 1450-1500.",clue:"Hai seguito il filo etrusco, medievale e mediceo. Il Beniamino ti aspetta a Marzocchino."},

  // LA LUCERTOLA
  {id:"lucertola-ripa",mapId:"lucertola",nome:"Il Vecchio di Ripa",position:[5,6],text:"Ripa prende il nome dalla sua posizione sulla più alta ripa del fiume Versilia. Il luogo è documentato già nel XIV secolo insieme a diversi toponimi circostanti. Ai piedi delle Apuane, protetta dai venti freddi, Ripa sviluppò un clima mite e una comunità vivace.",clue:"La sua posizione elevata non era casuale: cerca la sentinella."},
  {id:"lucertola-sentinella",mapId:"lucertola",nome:"La Sentinella della Ripa",position:[14,7],text:"Le alture di Ripa offrivano un punto di osservazione verso la costa, minacciata dalle incursioni dei corsari. Il paese fu spesso luogo di sosta per le milizie di passaggio.",clue:"Molti eserciti attraversarono Ripa. Un cronista ricorda due passaggi particolarmente importanti."},
  {id:"lucertola-eserciti",mapId:"lucertola",nome:"Il Cronista dei Passaggi",position:[23,6],text:"Nel 1533 passarono da Ripa la Duchessa d'Orléans e l'ammiraglio Andrea Doria con numerose truppe. Dodici anni dopo, nel 1545, passarono soldati spagnoli. Ogni esercito imponeva alla popolazione di offrire ospitalità e cibo.",clue:"Dopo i soldati arrivarono tempi più tranquilli. Cerca chi ricorda le famiglie di Ripa."},
  {id:"lucertola-signora",mapId:"lucertola",nome:"La Signora di Ripa",position:[8,14],text:"In epoche successive Ripa divenne una residenza invernale scelta da famiglie benestanti di Seravezza. Prima della soppressione dei comunelli si contavano 42 famiglie e circa 150 abitanti. La protezione delle Apuane e il clima mite favorirono una comunità quasi autosufficiente, vivace nel lavoro e nella vita sociale.",clue:"Ma il Novecento portò una ferita profonda. Cerca chi custodisce ciò che sopravvisse al 1944."},
  {id:"lucertola-marginetta",mapId:"lucertola",nome:"Il Custode della Marginetta",position:[19,14],text:"Nel luglio 1944, durante la ritirata tedesca, le truppe minarono e distrussero completamente il paese. Sopravvisse soltanto una piccola marginetta lungo la strada, dedicata alla Madonna del Soccorso. Dopo la guerra Ripa fu ricostruita e tornò a essere una comunità viva e legata alle proprie tradizioni.",clue:"Dalla distruzione nacque anche il simbolo della Lucertola. Cerca il cantastorie della Contrada."},
  {id:"lucertola-cantastorie",mapId:"lucertola",nome:"Il Cantastorie della Lucertola",position:[25,18],text:"La tradizione conserva la storia d'amore di Laudomia e Lamberto, narrata da Massimo D'Azeglio nel romanzo «Niccolò de' Lapi», ambientato in Seravezza e Versilia. Il simbolo della Contrada è la lucertola: dopo la distruzione del 1944 fu vista come l'animale rimasto fedele alla propria terra, diventando simbolo di attaccamento alle radici e capacità di rinascere. La Lucertola veste rosso e verde e rievoca il 1400-1500. Fu la prima Contrada a realizzare costumi storici rinascimentali e promosse iniziative folkloristiche come la banda «La Rusticana» e il tradizionale Gioco della Torre.",clue:"La rinascita di Ripa è la tua ultima traccia. Il Beniamino è vicino al cuore della Contrada."},

  // LA MADONNINA
  {id:"madonnina-brancagliano",mapId:"madonnina",nome:"Lo Storico di Brancagliano",position:[5,6],text:"La storia della Madonnina è legata a Querceta e all'antico Borgo di Brancagliano. Gli storici ritengono che il borgo, in pianura sulla sponda destra del Versilia e sulla Via Romea, fosse nei pressi degli attuali Ponterosso e Chiesa di San Bartolomeo. Fu distrutto dai Lucchesi nel 1170 e probabilmente scomparve definitivamente nel XIII secolo, durante le guerre toscane.",clue:"Una chiesa documentata nel 1220 potrebbe essere sorta sulle rovine del borgo. Segui il pellegrino."},
  {id:"madonnina-romea",mapId:"madonnina",nome:"Il Pellegrino della Via Romea",position:[13,7],text:"La chiesa di San Bartolomeo è documentata nel 1220 e potrebbe essere stata ricostruita sui resti dell'antica chiesa di Brancagliano. La Madonnina, vicina al borgo e attraversata dalla Via Romea, condivise probabilmente gli eventi e le distruzioni di quella zona. Il territorio fu poi rapidamente ripopolato seguendo la crescita di Querceta.",clue:"La strada antica porta anche a tracce molto più vecchie: cerca l'archeologo romano."},
  {id:"madonnina-romano",mapId:"madonnina",nome:"L'Archeologo Romano",position:[22,6],text:"Secondo Leopoldo Belli, nel suo studio «Aspetti della colonizzazione romana in Versilia», vicino all'attuale Via Madonnina e al Fiumetto sono stati riconosciuti resti di muri e accumuli di pietre attribuibili alla centuriazione romana. La zona conserva quindi tracce di una storia precedente al borgo medievale.",clue:"Dopo guerre e ripopolamento, la campagna tornò a vivere. Cerca chi coltivava queste terre."},
  {id:"madonnina-contadino",mapId:"madonnina",nome:"Il Contadino della Madonnina",position:[7,14],text:"Le testimonianze storiche più affidabili sulla Madonnina riguardano soprattutto gli ultimi tre secoli. Il villaggio si sviluppò lungo l'antica strada romana, la popolazione crebbe e l'agricoltura, in particolare la coltivazione degli ulivi, divenne parte della vita quotidiana.",clue:"Una tradizione del 1347 racconta però un evento che avrebbe dato un simbolo alla Contrada. Cerca la ragazza del pagliaio."},
  {id:"madonnina-geltrude",mapId:"madonnina",nome:"La Ragazza del Pagliaio",position:[18,14],text:"Secondo la tradizione, nel 1347 una giovane contadina raccolse il fieno quando fu attirata da un intenso raggio di luce proveniente da un pagliaio. Trovò una piccola immagine della Madonna che rifletteva la luce del sole. Alcune fonti la chiamano Geltrude, altre Alba. L'immagine fu collocata in una marginetta lungo la strada dei pellegrini diretti a Roma e divenne oggetto di devozione.",clue:"Dopo quasi sei secoli la marginetta lasciò spazio a una piccola chiesa. Cerca il suo custode."},
  {id:"madonnina-custode",mapId:"madonnina",nome:"Il Custode della Chiesina",position:[24,19],text:"La piccola chiesa della Contrada fu costruita nel 1922 nel luogo dove sorgeva l'antico tabernacolo. Oggi il cuore della Madonnina continua lungo Via Aurelia, vicino all'antico incrocio, dove si trova la sede sociale. Il territorio ha mantenuto a lungo il suo carattere, anche se la grande espansione edilizia è arrivata soprattutto negli ultimi decenni. I costumi rievocano il 1350-1450, i colori sono giallo e azzurro e la Contrada è quella con il maggior numero di vittorie nella Corsa del Miccio.",clue:"Hai seguito la luce dal 1347 alla chiesa moderna. Il Beniamino è nascosto nella zona della Madonnina."},

  // IL PONTE
  {id:"ponte-tavole",mapId:"ponte",nome:"Il Vecchio di Ponte di Tavole",position:[5,6],text:"Intorno al 1550 si comincia a parlare di Ponte di Tavole. Il popolo pietrasantese era continuamente minacciato dalle piene del Versilia e il Governo Mediceo decise di realizzare un Fosso Scaricatore verso il Lago di Porta. Il nuovo alveo attraversò i terreni di Querceta e fu ampliato e approfondito per ridurre i danni delle esondazioni ai campi di Ponte di Tavole.",clue:"L'acqua cambiò il territorio. Cerca il Guardiano del Fosso."},
  {id:"ponte-fosso",mapId:"ponte",nome:"Il Guardiano del Fosso",position:[13,8],text:"Nel tempo il corso del Versilia fu deviato definitivamente verso il Lago di Porta. Fu costruita una rete di fossi e canali per convogliare al mare le acque stagnanti, che favorivano anche la diffusione della malaria.",clue:"Ma il Ponte non era solo acqua: lungo la Via dei Marmi passavano merci preziose. Cerca il marmista."},
  {id:"ponte-marmista",mapId:"ponte",nome:"Il Marmista del Ponte",position:[22,6],text:"Il primo ponte lungo la Via dei Marmi, progettata da Michelangelo Buonarroti, era costruito con travi e tavole di legno. Da questa caratteristica nacque il nome Ponte di Tavole e, in seguito, il nome della Contrada. La strada collegava le zone del marmo al mare e vide il passaggio di carri carichi di marmo e ferro verso il Caricatoio del Magazzeno, nell'attuale Forte dei Marmi.",clue:"Il ponte di legno non durò per sempre. Cerca l'ingegnere che lo ricostruì."},
  {id:"ponte-franchi",mapId:"ponte",nome:"Il Tecnico di Giovanni Franchi",position:[26,13],text:"Nei primi anni del Settecento, durante gli interventi dell'ingegnere Giovanni Franchi, il ponte fu ricostruito in muratura. Doveva resistere alla forza delle piene e al continuo passaggio dei carri che trasportavano marmo e ferro verso il Caricatoio del Magazzeno.",clue:"Il cuore antico della Contrada era però più a ovest. Cerca il Vecchio della Vaiana."},
  {id:"ponte-vaiana",mapId:"ponte",nome:"Il Vecchio della Vaiana",position:[9,17],text:"Il nucleo originario della Contrada era la Vaiana, collegata a Querceta attraverso le Mordure. La zona si sviluppò lungo una delle antiche strade riconducibili alla centuriazione romana del territorio.",clue:"Il Ponte ha anche una storia tramandata dal mare. Cerca Zaira."},
  {id:"ponte-zaira",mapId:"ponte",nome:"Zaira",position:[21,19],text:"La tradizione popolare racconta le incursioni dei corsari sulla costa versiliese. La più celebre narra dello sbarco di Khayr al-Din, che avrebbe sorpreso il villaggio, saccheggiato il paese e rapito Zaira, considerata la ragazza più bella del Ponte. Dopo alcuni anni la nave tornò: Zaira, ormai sua sposa, convinse il corsaro a sbarcare pacificamente. Secondo il racconto la comunità festeggiò per tre giorni e tre notti e la coppia tornò negli anni successivi con un seguito sempre più numeroso. Oggi il Ponte si sviluppa dalla Vaiana verso Forte dei Marmi, dove l'espansione turistica ha favorito crescita economica e urbanistica. I colori sono rosso e blu e i costumi rievocano il 1500-1550.",clue:"La storia documentata e la tradizione si incontrano qui. Il Beniamino è vicino alla Vaiana."},

  // IL POZZO
  {id:"pozzo-archeologo",mapId:"pozzo",nome:"L'Archeologo del Pozzo",position:[5,6],text:"L'origine di Pozzi è legata a Querceta, Ripa e Strettoia. È ragionevole pensare a insediamenti etruschi già dal VII secolo a.C. Nel luglio 1982, durante scavi nella proprietà del professor Enrico Baldi, furono trovati a circa un metro e mezzo di profondità numerosi frammenti di terracotta, vasi, ceramiche in argilla e bucchero grigio-nero, facendo ipotizzare un'antica sepoltura etrusca.",clue:"La terra nascondeva altri indizi. Cerca il Custode del Vaso."},
  {id:"pozzo-vaso",mapId:"pozzo",nome:"Il Custode del Vaso Etrusco",position:[13,6],text:"Pochi mesi dopo il primo scavo, durante la posa di un palo telefonico nella stessa proprietà, comparvero altri frammenti di ceramica e un piccolo vaso con alcune lettere etrusche incise. Il reperto è oggi conservato presso la Soprintendenza Archeologica di Firenze.",clue:"Ma non fu l'unica scoperta: tra Ripa e Pozzi c'è una tomba ancora più antica. Cerca il Guardiano del Poggione."},
  {id:"pozzo-poggione",mapId:"pozzo",nome:"Il Guardiano del Poggione",position:[23,7],text:"Nel 1959, nella località del Poggione tra Ripa e Pozzi, fu scoperta una tomba a incinerazione contenente armi in ferro e numerosi vasi etruschi databili al VII-VI secolo a.C.",clue:"Dagli Etruschi ai Romani: un antico confine passava probabilmente proprio da queste terre."},
  {id:"pozzo-luni",mapId:"pozzo",nome:"Il Misuratore di Luni",position:[7,14],text:"Nei secoli successivi Pozzi condivise gran parte della propria storia con Querceta, Ripa e Corvaia. Secondo gli studi di Leopoldo Belli, proprio in questa zona si trovava probabilmente il confine meridionale del territorio centuriato romano appartenente all'antica città di Luni. Le borgate più antiche dell'attuale Pozzi possono essere fatte risalire al XVI secolo.",clue:"La memoria di Pozzi non parla solo di confini: racconta anche di persone che non vollero lasciare la propria terra."},
  {id:"pozzo-ribelle",mapId:"pozzo",nome:"Il Pozzese Ribelle",position:[18,16],text:"La tradizione popolare racconta che intorno al 1250 gli abitanti delle antiche borgate di Pozzi furono costretti a trasferirsi nel territorio di Camaiore. Legati alla propria terra, tornarono poco alla volta nelle loro case, sfidando il rischio di pesanti punizioni. L'episodio è rimasto nella memoria collettiva come simbolo dell'orgoglio e dell'attaccamento dei pozzesi al proprio territorio.",clue:"L'ultima storia porta alla comunità di oggi, tra il fiume, la ferrovia e le borgate."},
  {id:"pozzo-comunita",mapId:"pozzo",nome:"Il Custode della Comunità",position:[25,19],text:"Il territorio storico della Contrada va dalla Foccola alla ferrovia e dal fiume Versilia fino al Borgo dei Terrinchesi e al Baraglino. Oggi è più popolato e continua a svilupparsi ediliziamente. La Contrada ha una propria chiesa, importante punto di riferimento e centro della vita sociale. Il Pozzo veste bianco e rosso e rievoca il periodo 1400-1500.",clue:"Hai seguito Pozzi dagli Etruschi alla comunità moderna. Il Beniamino ti aspetta nel suo territorio."},

  // LA QUERCIA
  {id:"quercia-contadino",mapId:"quercia",nome:"Il Contadino delle Querce",position:[5,5],text:"La Quercia rappresenta il centro cittadino e la sua storia coincide con quella di Querceta. Nel XIV secolo il territorio era coltivato a pasture, segale, miglio, fave e gelsi. I campi di grano erano pochi e gli ulivi quasi assenti. Gran parte della zona era invece coperta da grandi boschi di querce: da qui il nome della Contrada.",clue:"Il paesaggio cambiò con una nuova strada. Cerca il Custode della Via Maestra."},
  {id:"quercia-strada",mapId:"quercia",nome:"Il Custode della Via Maestra",position:[13,7],text:"Per lungo tempo l'unica strada di rilievo fu l'antica Via Maestra. Ai tempi di Michelangelo Buonarroti il territorio fu attraversato dalla Via dei Marmi, realizzata per collegare Seravezza al mare e favorire il trasporto del marmo.",clue:"Alla fine del Cinquecento Querceta aveva anche una propria organizzazione territoriale. Cerca il Vecchio del Comunello."},
  {id:"quercia-comunello",mapId:"quercia",nome:"Il Vecchio del Comunello",position:[23,6],text:"Alla fine del XVI secolo Querceta formava un comunello insieme a Strettoia e Campiglione. È il contesto storico che porta verso il periodo mediceo rappresentato oggi dalla Contrada, tra grandi opere sul territorio e sviluppo civile.",clue:"Poi arrivò un'immagine che cambiò la storia del centro. Cerca il Pellegrino Francese."},
  {id:"quercia-pellegrino",mapId:"quercia",nome:"Il Pellegrino Francese",position:[7,15],text:"All'inizio del 1644 un pellegrino francese lasciò appesa a una quercia, secondo alcune fonti a un muro, un'immagine della Madonna di Loreto. Il ritrovamento suscitò una grande devozione e nacque l'idea di costruire una chiesa.",clue:"La devozione provocò una lunga disputa tra territori e istituzioni. Cerca il Costruttore di Santa Maria."},
  {id:"quercia-costruzione",mapId:"quercia",nome:"Il Costruttore di Santa Maria",position:[17,14],text:"La costruzione di Santa Maria Lauretana provocò una lunga controversia tra Seravezza, la Pieve di Vallecchia e Pietrasanta. La disputa fu risolta il 24 luglio 1672 dai Signori Nove del Governo, con l'aggregazione di una parte della Querceta al territorio di Seravezza. La prima pietra della chiesa fu posta il 15 aprile 1645 sotto l'altare maggiore dall'Abate di Massa. Tutta la popolazione partecipò con entusiasmo, trasportando personalmente le pietre. Nel 1783 la chiesa fu elevata a Rettoria e la popolazione superava già i mille abitanti. Il pievano Marini la definì una delle chiese più belle della Versilia.",clue:"La storia ufficiale della chiesa ha anche una tradizione di miracoli. Cerca la Devota di Querceta."},
  {id:"quercia-devota",mapId:"quercia",nome:"La Devota di Querceta",position:[25,19],text:"La tradizione racconta che l'immagine della Madonna di Loreto fu trasferita in una casa di Seravezza. Quella notte una violenta tempesta di vento, pioggia, grandine e fulmini danneggiò porte, finestre e muri, ma le lampade davanti all'immagine sarebbero rimaste accese e il dipinto non sarebbe stato danneggiato dai fulmini. L'immagine fu riportata a Querceta e venerata da migliaia di pellegrini. La tradizione attribuisce alla sua intercessione numerose guarigioni. Oggi La Quercia rappresenta il centro cittadino, gravita attorno a Santa Maria Lauretana, rievoca il 1500-1600 e veste bianco e nero, con l'arancione come terzo colore tradizionale.",clue:"Hai ricostruito il cuore di Querceta. Il Beniamino è vicino alla chiesa."},

  // IL RANOCCHIO
  {id:"ranocchio-paludi",mapId:"ranocchio",nome:"Il Vecchio del Ranocchiaio",position:[5,6],text:"La Contrada nasce nel cuore di Querceta e si estende verso ovest fino al confine con Ponte di Tavole e Frasso. In tempi antichi la zona era ricca di paludi e acquitrini, habitat ideale per numerose colonie di anfibi anuri, i ranocchi. Da questo ambiente derivano il nome Ranocchiaio e quello della Contrada. Anche giallo e verde richiamano la campagna e la natura del territorio.",clue:"Dalle campagne arrivarono i primi abitanti. Cerca il Pastore delle Apuane."},
  {id:"ranocchio-pastore",mapId:"ranocchio",nome:"Il Pastore delle Apuane",position:[13,6],text:"I primi abitanti della Contrada furono soprattutto pastori e agricoltori provenienti dalle Alpi Apuane e dalla vicina Seravezza. Furono attratti dalla possibilità di trovare migliori condizioni di vita. Il continuo flusso di popolazione contribuì allo sviluppo edilizio ed economico di Querceta e dell'intera Versilia centrale.",clue:"La comunità crebbe. Cerca chi ricorda il censimento del 1672."},
  {id:"ranocchio-1672",mapId:"ranocchio",nome:"Il Capofamiglia del 1672",position:[22,6],text:"La costruzione della Chiesa di Santa Maria Lauretana, iniziata nel 1645, testimonia una comunità ormai numerosa. Nel 1672, al momento dell'annessione di Querceta a Seravezza, gli abitanti erano 819 divisi in 178 famiglie. È molto probabile che una parte importante della popolazione risiedesse nell'area del Ranocchiaio, come suggeriscono l'età di numerosi edifici e le testimonianze storiche.",clue:"Il borgo continuò a crescere. Cerca il muratore che conta le case dell'Ottocento."},
  {id:"ranocchio-muratore",mapId:"ranocchio",nome:"Il Muratore del Ranocchiaio",position:[7,14],text:"Nei primi anni dell'Ottocento risultavano censiti ben 62 edifici nel Ranocchiaio. La crescita edilizia racconta la trasformazione di un antico ambiente rurale in una comunità stabile e sempre più importante per Querceta. Prima del XVII secolo la zona aveva avuto un'importanza limitata, ma in seguito divenne rilevante anche nella lunga controversia territoriale tra Pietrasanta e Seravezza sui confini della Querceta.",clue:"I vecchi abitanti lasciarono anche un patrimonio di credenze. Cerca il Contadino delle Superstizioni."},
  {id:"ranocchio-superstizioni",mapId:"ranocchio",nome:"Il Contadino delle Superstizioni",position:[17,15],text:"Il Ranocchio non conserva una leggenda popolare unica come altre Contrade. La tradizione ha invece tramandato molte superstizioni della civiltà contadina, legate alla vita quotidiana, agli animali, al clima, ai raccolti e al lavoro nei campi. Sono credenze passate di generazione in generazione nelle famiglie delle campagne.",clue:"Dal borgo rurale alla Contrada moderna: cerca il Contradaiolo vicino alla sede."},
  {id:"ranocchio-oggi",mapId:"ranocchio",nome:"Il Contradaiolo del Ranocchio",position:[25,19],text:"L'antico borgo del Ranocchiaio si è sviluppato molto. A sud e a ovest sono sorti nuovi quartieri residenziali; vicino al fiume Versilia si sono insediate attività artigianali e industriali. La variante della strada provinciale verso Forte dei Marmi ha favorito altra crescita urbanistica. Lungo questa direttrice si trova la sede della Contrada, con un centro che ospita sagre gastronomiche, manifestazioni e spettacoli. Il Ranocchio partecipa al Palio con costumi ispirati al 1400-1500 e i colori giallo e verde.",clue:"Dal canto dei ranocchi alla comunità di oggi: il Beniamino è nascosto nella zona del Ranocchiaio."}
];

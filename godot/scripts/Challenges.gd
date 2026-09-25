extends Node
## FantaMiccio — otto prove pre-Beniamino.
## Ogni prova ha una meccanica diversa e una catena narrativa di indizi.

const CHALLENGES := {
    "cervia": {
        "title": "La Torre di Beltrame",
        "type": "platform",
        "goal": "Raggiungi la campana in cima alla torre evitando travi e cadute.",
        "time": 75,
        "reward": "cervia",
        "hint": "La torre non si apre con la forza: sali seguendo i segni lasciati sulle pietre."
    },
    "pozzo": {
        "title": "Il Mistero del Miccio",
        "type": "investigation",
        "goal": "Trova gli indizi e ricostruisci l'ordine corretto del mistero.",
        "time": 120,
        "reward": "pozzo",
        "hint": "Tre tracce raccontano la storia. Cercale prima di dare la risposta."
    },
    "leondoro": {
        "title": "La Tana del Leone",
        "type": "survival",
        "goal": "Resisti 30 secondi nella tana senza essere colpito.",
        "time": 30,
        "reward": "leondoro",
        "hint": "Il Leone ascolta i tuoi passi: muoviti, cambia direzione e usa lo spazio."
    },
    "ranocchio": {
        "title": "Il Loto d'Oro",
        "type": "platform",
        "goal": "Salta sulle ninfee e raggiungi il Loto d'Oro senza cadere.",
        "time": 60,
        "reward": "ranocchio",
        "hint": "Le ninfee non aspettano. Alcune affondano dopo il primo salto."
    },
    "quercia": {
        "title": "La Corsa tra le Querce",
        "type": "maze",
        "goal": "Segui i tre segni dorati e raggiungi la Quercia Antica.",
        "time": 90,
        "reward": "quercia",
        "hint": "Il sentiero giusto non è quello più diretto."
    },
    "ponte": {
        "title": "Il Ponte di Tavole",
        "type": "timing",
        "goal": "Attraversa il ponte prima che le tavole cedano.",
        "time": 55,
        "reward": "ponte",
        "hint": "Guarda il ritmo delle tavole: il percorso sicuro si ripete."
    },
    "madonnina": {
        "title": "Il Pagliaio Perduto",
        "type": "memory",
        "goal": "Trova il simbolo nascosto ricordando la posizione degli indizi.",
        "time": 90,
        "reward": "madonnina",
        "hint": "Prima osserva. Poi cerca. La memoria vale più della velocità."
    },
    "lucertola": {
        "title": "La Via della Ripa",
        "type": "route",
        "goal": "Segui la Ripa e scegli il bivio corretto fino al Beniamino.",
        "time": 75,
        "reward": "lucertola",
        "hint": "Una strada è più facile. L'altra è quella giusta."
    }
}

func get_challenge(contrada: String) -> Dictionary:
    return CHALLENGES.get(contrada.to_lower(), {})

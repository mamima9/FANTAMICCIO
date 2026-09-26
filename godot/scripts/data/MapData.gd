extends RefCounted
class_name MapData

const MAPS := {
    "quercia": {
        "name": "La Quercia",
        "color": Color("#526f45"),
        "accent": Color("#d6ad4d"),
        "spawn": Vector2(640, 430),
        "challenge": "quercia",
        "beniamino": "quercia",
        "description": "Il cuore verde del viaggio.",
        "neighbors": {"up": "ranocchio", "right": "leondoro", "down": "madonnina", "left": "ponte"}
    },
    "ranocchio": {
        "name": "Il Ranocchio",
        "color": Color("#477c54"),
        "accent": Color("#e3c44f"),
        "spawn": Vector2(640, 560),
        "challenge": "ranocchio",
        "beniamino": "ranocchio",
        "description": "Un territorio umido, allegro e pieno di sentieri.",
        "neighbors": {"down": "quercia"}
    },
    "leondoro": {
        "name": "Il Leon d'Oro",
        "color": Color("#a87922"),
        "accent": Color("#c74336"),
        "spawn": Vector2(100, 360),
        "challenge": "leondoro",
        "beniamino": "leondoro",
        "description": "Piazze dorate e bandiere rosse.",
        "neighbors": {"left": "quercia", "right": "lucertola"}
    },
    "lucertola": {
        "name": "La Lucertola",
        "color": Color("#7e493d"),
        "accent": Color("#4e934f"),
        "spawn": Vector2(100, 360),
        "challenge": "lucertola",
        "beniamino": "lucertola",
        "description": "Vicoli stretti e angoli da scoprire.",
        "neighbors": {"left": "leondoro", "down": "pozzo"}
    },
    "pozzo": {
        "name": "Il Pozzo",
        "color": Color("#5a6174"),
        "accent": Color("#e4d9c0"),
        "spawn": Vector2(640, 100),
        "challenge": "pozzo",
        "beniamino": "pozzo",
        "description": "Una zona fresca costruita attorno al vecchio pozzo.",
        "neighbors": {"up": "lucertola", "left": "cervia"}
    },
    "cervia": {
        "name": "La Cervia",
        "color": Color("#d7d3c6"),
        "accent": Color("#77aeca"),
        "spawn": Vector2(1180, 360),
        "challenge": "cervia",
        "beniamino": "cervia",
        "description": "Una contrada luminosa con azzurro e bianco.",
        "neighbors": {"right": "pozzo"}
    },
    "madonnina": {
        "name": "La Madonnina",
        "color": Color("#466d9f"),
        "accent": Color("#e1c64c"),
        "spawn": Vector2(640, 100),
        "challenge": "madonnina",
        "beniamino": "madonnina",
        "description": "Un territorio aperto tra blu e oro.",
        "neighbors": {"up": "quercia", "right": "ponte"}
    },
    "ponte": {
        "name": "Il Ponte",
        "color": Color("#4b6f9e"),
        "accent": Color("#c94b45"),
        "spawn": Vector2(1180, 360),
        "challenge": "ponte",
        "beniamino": "ponte",
        "description": "Passaggi, acqua e vecchi ponti.",
        "neighbors": {"right": "quercia", "left": "madonnina"}
    }
}

static func get_map(id: String) -> Dictionary:
    return MAPS.get(id, MAPS["quercia"])

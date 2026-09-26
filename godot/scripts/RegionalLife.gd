extends Node2D

# Libreria ambientale comune alle otto Contrade.
# Quando viene creata una nuova mappa, basta impostare contrada_id:
# il territorio prende una fauna e un elemento architettonico riconoscibile.
@export_enum("cervia","lucertola","madonnina","quercia","leondoro","ponte","pozzo","ranocchio") var contrada_id := "quercia"

const REGIONS := {
    "cervia": {"fauna":"cervo", "landmark":"radura_dei_cervi"},
    "lucertola": {"fauna":"lucertola", "landmark":"ripa"},
    "madonnina": {"fauna":"uccelli", "landmark":"pagliaio"},
    "quercia": {"fauna":"scoiattolo", "landmark":"querceto"},
    "leondoro": {"fauna":"leoncino", "landmark":"tana"},
    "ponte": {"fauna":"uccelli", "landmark":"ponte"},
    "pozzo": {"fauna":"uccelli", "landmark":"pozzo"},
    "ranocchio": {"fauna":"rana", "landmark":"stagno"}
}

func get_region_data() -> Dictionary:
    return REGIONS.get(contrada_id, REGIONS["quercia"])

func get_fauna() -> String:
    return get_region_data()["fauna"]

func get_landmark() -> String:
    return get_region_data()["landmark"]

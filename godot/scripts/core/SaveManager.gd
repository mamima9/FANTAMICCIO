extends Node

const SAVE_PATH := "user://fantamiccio_offseason.json"

func save_game() -> void:
    var data := {
        "map": GameManager.current_map,
        "beniami": GameManager.collected_beniamini,
        "trials": GameManager.completed_trials,
        "secrets": GameManager.discovered_secrets
    }
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(data))

func load_game() -> void:
    if not FileAccess.file_exists(SAVE_PATH):
        return
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if not file:
        return
    var parsed = JSON.parse_string(file.get_as_text())
    if typeof(parsed) != TYPE_DICTIONARY:
        return
    GameManager.current_map = str(parsed.get("map", "quercia"))
    GameManager.collected_beniamini = parsed.get("beniami", {})
    GameManager.completed_trials = parsed.get("trials", {})
    GameManager.discovered_secrets = parsed.get("secrets", {})

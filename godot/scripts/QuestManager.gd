extends Node

signal changed(step: int)

var step := 0
var complete := false
var discoveries := 0

const OBJECTIVES := [
    "Parla al Custode delle Querce.",
    "Hai il primo indizio. Cerca il Vecchio della Bottega.",
    "Segui i tre segni dorati e trova il Contradaiolo.",
    "La prova è pronta. Torna dal Contradaiolo."
]

func _ready() -> void:
    step = 0

func can_talk(required_step: int) -> bool:
    return required_step == step or (required_step == 3 and complete)

func advance() -> void:
    if complete:
        return
    step = min(step + 1, 3)
    changed.emit(step)
    _refresh_world()

func discover_clue(index: int) -> void:
    if complete:
        return
    if index != step - 1:
        return
    discoveries = max(discoveries, index + 1)
    changed.emit(step)
    _refresh_world()

func mark_complete() -> void:
    complete = true
    step = 4
    changed.emit(step)
    _refresh_world()

func get_objective() -> String:
    if complete:
        return "Beniamino trovato. La Quercia è stata completata."
    return OBJECTIVES[step]

func _refresh_world() -> void:
    var main = get_tree().current_scene
    if main and main.has_method("refresh_objective"):
        main.refresh_objective()
    var world = main.get_node_or_null("QuestWorld") if main else null
    if world and world.has_method("refresh"):
        world.refresh()

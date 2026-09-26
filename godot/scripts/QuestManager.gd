extends Node

signal changed(step: int)

var step := 0
var complete := false
var discoveries := 0
var active_npc := ""

const OBJECTIVES := [
    "Parla al Custode delle Querce.",
    "Hai l'indizio del Custode. Trova il Vecchio della Bottega.",
    "Hai il secondo indizio. Segui il bosco e trova il Contradaiolo.",
    "Hai tutti gli indizi. Torna dal Contradaiolo per affrontare la prova."
]

func _ready() -> void:
    step = 0
    complete = false
    discoveries = 0

func can_talk(required_step: int) -> bool:
    if complete:
        return false
    return required_step == step

func can_start_trial(trial_id: String) -> bool:
    return not complete and trial_id != "" and step >= 3 and discoveries >= 3

func advance() -> void:
    if complete:
        return
    step = min(step + 1, 3)
    changed.emit(step)
    _refresh_world()

func discover_clue(index: int) -> bool:
    if complete:
        return false
    if index != discoveries:
        return false
    if index >= 3:
        return false
    discoveries += 1
    changed.emit(step)
    _refresh_world()
    return true

func mark_complete() -> void:
    complete = true
    step = 4
    changed.emit(step)
    _refresh_world()

func get_objective() -> String:
    if complete:
        return "Beniamino trovato. La Quercia è stata completata."
    return OBJECTIVES[step]

func get_progress_text() -> String:
    return "%d / 3 indizi" % discoveries

func _refresh_world() -> void:
    var main = get_tree().current_scene
    if main and main.has_method("refresh_objective"):
        main.refresh_objective()
    var world = main.get_node_or_null("QuestWorld") if main else null
    if world and world.has_method("refresh"):
        world.refresh()

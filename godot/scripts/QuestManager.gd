extends Node

signal changed(step: int)

var step := 0
var complete := false
var discoveries := 0
var active_npc := ""
var contrada_id := "quercia"

const OBJECTIVES_BY_CONTRADA := {
 "cervia":["Parla al Custode di Beltrame.","Trova il secondo indizio vicino alla Torre.","Segui i segni fino al Campanaro.","Hai tutti gli indizi. Affronta la Torre di Beltrame."],
 "leondoro":["Parla al Custode del Marzocchino.","Segui le tracce verso la tana.","Trova il terzo indizio tra i cuccioli.","Hai tutti gli indizi. Affronta la Tana del Leone."],
 "lucertola":["Parla al Custode della Ripa.","Trova il secondo segno sulle pietre.","Segui le tracce fino al bivio.","Hai tutti gli indizi. Affronta la Via della Ripa."],
 "madonnina":["Parla alla Custode dei Pagliai.","Cerca il secondo simbolo tra i covoni.","Memorizza l'ultimo segno.","Hai tutti gli indizi. Affronta il Pagliaio Perduto."],
 "ponte":["Parla al Custode del Ponte.","Trova la tavola con il primo segno.","Segui il ritmo dell'acqua.","Hai tutti gli indizi. Affronta il Ponte di Tavole."],
 "pozzo":["Parla al Custode del Pozzo.","Cerca la pietra bagnata.","Ricostruisci il mistero del Miccio.","Hai tutti gli indizi. Affronta il Mistero del Miccio."],
 "quercia":["Parla al Custode delle Querce.","Trova il secondo segno nel bosco.","Segui le tre tracce dorate.","Hai tutti gli indizi. Affronta la Corsa tra le Querce."],
 "ranocchio":["Parla al Custode dello Stagno.","Segui le impronte delle rane.","Trova il segno del Loto.","Hai tutti gli indizi. Affronta il Loto d'Oro."]
}

func set_contrada(id:String) -> void:
    contrada_id = id.to_lower()
    changed.emit(step)

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
    var objectives:Array = OBJECTIVES_BY_CONTRADA.get(contrada_id, OBJECTIVES_BY_CONTRADA["quercia"])\n    return objectives[step]

func get_progress_text() -> String:
    return "%d / 3 indizi" % discoveries

func _refresh_world() -> void:
    var main = get_tree().current_scene
    if main and main.has_method("refresh_objective"):
        main.refresh_objective()
    var world = main.get_node_or_null("QuestWorld") if main else null
    if world and world.has_method("refresh"):
        world.refresh()

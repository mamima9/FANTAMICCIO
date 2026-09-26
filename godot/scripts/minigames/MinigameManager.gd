extends Node

var overlay: Control
var trial: Control

func _ready() -> void:
    overlay = Control.new()
    overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    overlay.mouse_filter = Control.MOUSE_FILTER_STOP
    overlay.visible = false
    add_child(overlay)

    trial = load("res://scripts/minigames/Minigame.gd").new()
    trial.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    overlay.add_child(trial)
    trial.finished.connect(_on_trial_finished)

func start_trial(contrada_id: String) -> void:
    get_tree().paused = true
    overlay.process_mode = Node.PROCESS_MODE_ALWAYS
    overlay.visible = true
    trial.start(contrada_id)

func _on_trial_finished(success: bool) -> void:
    overlay.visible = false
    get_tree().paused = false

    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        if success:
            main.show_interaction("Prova completata!", "Hai superato la prova. Torna dal Beniamino.")
        else:
            main.show_interaction("Prova fallita", "Riprova: il tempo è scaduto.")

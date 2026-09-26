extends Node

var trial: CanvasLayer = null

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS

func start_trial(contrada_id: String) -> void:
    if trial != null and is_instance_valid(trial):
        return

    # The TrialGame scene contains the eight documented mechanics.
    trial = preload("res://scenes/TrialGame.tscn").instantiate()
    trial.process_mode = Node.PROCESS_MODE_ALWAYS
    get_tree().current_scene.add_child(trial)
    trial.won.connect(_on_trial_won)
    trial.failed.connect(_on_trial_failed)

    get_tree().paused = true
    trial.start(contrada_id)

func _finish_trial() -> void:
    get_tree().paused = false
    if trial != null and is_instance_valid(trial):
        trial.queue_free()
    trial = null

func _on_trial_won(id: String) -> void:
    GameManager.complete_trial(id)
    SaveManager.save_game()
    WebBridge.progress("trial_completed", id)
    _finish_trial()
    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        var total := GameManager.beniamino_count()
        if total >= 8:
            main.show_interaction("OTTO BENIAMINI!", "Hai completato tutte le otto Contrade. Ora puoi andare alla Tregua e cercare un giocatore di un'altra Contrada per ottenere il Barone.")
        else:
            main.show_interaction("PROVA SUPERATA!", "La prova di %s è completa. Torna dal Beniamino per aggiungerlo alla collezione." % id.capitalize())

func _on_trial_failed(_id: String) -> void:
    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction("PROVA FALLITA", "La prova non è stata superata. Riprova usando il pulsante di nuovo tentativo.")

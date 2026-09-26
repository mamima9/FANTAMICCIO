extends Area2D

@export var contrada_id := ""
@export var display_name := "Prova"

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func get_title() -> String:
    return display_name

func interact() -> void:
    if GameManager.trial_completed(contrada_id):
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(display_name, "Prova già completata. Cerca il Beniamino!")
        return

    var explored := GameManager.exploration_completed(contrada_id, 3)
    if not explored:
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(
                display_name,
                "La prova è ancora chiusa. Segui gli abitanti e trova i 3 indizi in ordine (%d/3)." % GameManager.exploration_progress(contrada_id)
            )
        return

    var manager = get_tree().current_scene.get_node_or_null("MinigameManager")
    if manager:
        manager.start_trial(contrada_id)

func _draw() -> void:
    # The landmark artwork is the visual destination. Only show a subtle
    # glow once the player has unlocked the trial.
    if not GameManager.exploration_completed(contrada_id, 3):
        return
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    var pulse := 1.0 + sin(Time.get_ticks_msec() * 0.004) * 0.08
    draw_circle(Vector2.ZERO, 16.0 * pulse, Color(accent, 0.12))
    draw_circle(Vector2.ZERO, 7.0, accent)

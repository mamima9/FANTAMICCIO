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
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    var unlocked := GameManager.exploration_completed(contrada_id, 3)
    var pulse := 1.0 + sin(Time.get_ticks_msec() * 0.004) * 0.08
    draw_circle(Vector2.ZERO, 31 * pulse, Color(accent, 0.10 if unlocked else 0.04))
    draw_circle(Vector2.ZERO, 24, accent.darkened(0.25))
    draw_circle(Vector2.ZERO, 17, accent if unlocked else accent.darkened(0.45))
    draw_string(ThemeDB.fallback_font, Vector2(-28, 40), "PROVA", HORIZONTAL_ALIGNMENT_CENTER, 56, 11, Color("#fff0c0"))
    if GameManager.trial_completed(contrada_id):
        draw_string(ThemeDB.fallback_font, Vector2(-22, -31), "OK", HORIZONTAL_ALIGNMENT_CENTER, 44, 14, Color("#d9f0a1"))
    elif not unlocked:
        draw_string(ThemeDB.fallback_font, Vector2(-24, 5), "CHIUSA", HORIZONTAL_ALIGNMENT_CENTER, 48, 9, Color("#fff0c0"))

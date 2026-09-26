extends Area2D

@export var contrada_id := ""
@export var display_name := "Prova"

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func interact() -> void:
    if GameManager.trial_completed(contrada_id):
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(display_name, "Prova già completata. Cerca il Beniamino!")
        return

    var manager = get_tree().current_scene.get_node_or_null("MinigameManager")
    if manager:
        manager.start_trial(contrada_id)

func _draw() -> void:
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    draw_circle(Vector2.ZERO, 24, accent.darkened(0.25))
    draw_circle(Vector2.ZERO, 17, accent)
    draw_string(ThemeDB.fallback_font, Vector2(-28, 40), "PROVA", HORIZONTAL_ALIGNMENT_CENTER, 56, 11, Color("#fff0c0"))

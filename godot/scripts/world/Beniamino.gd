extends Area2D

@export var contrada_id := ""
@export var display_name := "Beniamino"

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func interact() -> void:
    if not GameManager.trial_completed(contrada_id):
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(display_name, "La prova della Contrada non è ancora completata.")
        return

    if not GameManager.has_beniamino(contrada_id):
        GameManager.unlock_beniamino(contrada_id)
        WebBridge.progress("beniamino_unlocked", contrada_id)
    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(display_name, "Hai trovato il Beniamino! Ora appartiene alla tua collezione.")

func _draw() -> void:
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    draw_circle(Vector2.ZERO, 28, Color(0.03, 0.02, 0.01, 0.45))
    draw_circle(Vector2.ZERO, 22, accent)
    draw_circle(Vector2(-7, -5), 3, Color("#241913"))
    draw_circle(Vector2(7, -5), 3, Color("#241913"))
    draw_arc(Vector2.ZERO, 18, 0.2, 2.9, 24, Color("#fff0c0"), 3.0)
    draw_string(ThemeDB.fallback_font, Vector2(-45, 46), "BENIAMINO", HORIZONTAL_ALIGNMENT_CENTER, 90, 11, Color("#fff0c0"))

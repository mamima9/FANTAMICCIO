extends Area2D

@export var map_id := ""
@export var objective_step := 1
@export var objective_title := "Obiettivo"
@export_multiline var objective_text := "Hai trovato un indizio."

const TOTAL_STEPS := 3
var completed := false
var phase := 0.0

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    completed = GameManager.exploration_progress(map_id) >= objective_step
    queue_redraw()

func _process(delta: float) -> void:
    phase += delta
    queue_redraw()

func get_title() -> String:
    if completed:
        return "✓ " + objective_title
    return objective_title

func interact() -> void:
    var progress := GameManager.exploration_progress(map_id)
    if completed:
        var main := get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(objective_title, "Indizio già raccolto. Esplorazione: %d/%d." % [progress, TOTAL_STEPS])
        return

    if objective_step != progress + 1:
        var main := get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(objective_title, "Questo indizio si attiverà più avanti. Segui l'ordine della traccia.")
        return

    GameManager.complete_exploration_step(map_id, objective_step)
    completed = true
    SaveManager.save_game()
    WebBridge.progress("exploration_objective", map_id)

    var message := objective_text + "\n\n🔎 Traccia %d/%d completata." % [objective_step, TOTAL_STEPS]
    if objective_step == TOTAL_STEPS:
        message += "\n\n🏁 Hai completato l'esplorazione della Contrada!"
    else:
        message += "\nCerca la traccia successiva."
    var main := get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(objective_title, message)
    queue_redraw()

func _draw() -> void:
    var accent := MapData.get_map(map_id)["accent"] if MapData.MAPS.has(map_id) else Color("#d6ad4d")
    if completed:
        draw_circle(Vector2.ZERO, 15.0, Color(0.75, 0.95, 0.55, 0.22))
        draw_circle(Vector2.ZERO, 8.0, Color("#dff4a2"))
        draw_string(ThemeDB.fallback_font, Vector2(-5, 5), "✓", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("#4a6b2a"))
        return
    var active := GameManager.exploration_progress(map_id) == objective_step - 1
    var pulse := 1.0 + sin(phase * 3.0) * 0.10
    var alpha := 0.22 if active else 0.08
    draw_circle(Vector2.ZERO, 18.0 * pulse, Color(accent, alpha))
    draw_circle(Vector2.ZERO, 7.0, accent if active else Color(0.75, 0.75, 0.75, 0.55))
    draw_string(ThemeDB.fallback_font, Vector2(-4, -12), str(objective_step), HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("#fff0c0"))

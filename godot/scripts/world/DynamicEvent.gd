extends Area2D

@export var event_id := ""
@export var event_title := "Evento"
@export_multiline var event_text := "È successo qualcosa."
@export var cooldown := 8.0

var active := true
var timer := 0.0
var phase := 0.0

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func _process(delta: float) -> void:
    timer += delta
    phase += delta
    if not active and timer >= cooldown:
        active = true
        timer = 0.0
        queue_redraw()
    queue_redraw()

func get_title() -> String:
    return event_title if active else "Niente da vedere"

func interact() -> void:
    if not active:
        return
    active = false
    timer = 0.0
    SaveManager.save_game()
    WebBridge.progress("map_event", GameManager.current_map)
    var main := get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(event_title, event_text)

func _draw() -> void:
    if not active:
        draw_circle(Vector2.ZERO, 10.0, Color(1, 1, 1, 0.12))
        return
    var pulse := 1.0 + sin(phase * 3.0) * 0.12
    draw_circle(Vector2.ZERO, 18.0 * pulse, Color(1.0, 0.86, 0.25, 0.18))
    draw_circle(Vector2.ZERO, 7.0 * pulse, Color(1.0, 0.9, 0.35, 0.85))

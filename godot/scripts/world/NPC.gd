extends Area2D

@export var npc_name := "Abitante"
@export_multiline var dialogue := "Benvenuto a FantaMiccio!"

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func get_title() -> String:
    return npc_name

func interact() -> void:
    var main := get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(npc_name, dialogue)

func _draw() -> void:
    draw_circle(Vector2(0, 18), 16, Color(0.03, 0.02, 0.015, 0.35))
    draw_circle(Vector2(0, -8), 14, Color("#d9a56b"))
    draw_rect(Rect2(-13, 4, 26, 26), Color("#6c6f9b"))
    draw_rect(Rect2(-15, -22, 30, 7), Color("#b88939"))
    draw_circle(Vector2(-4, -9), 2, Color("#241913"))
    draw_circle(Vector2(4, -9), 2, Color("#241913"))

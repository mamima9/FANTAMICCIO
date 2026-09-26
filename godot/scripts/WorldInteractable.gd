extends Area2D

@export var title := "Punto d'interesse"
@export_multiline var text := "Qui c'è qualcosa da scoprire."
var player_near := false
var pulse := 0.0

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    if player_near and Input.is_action_just_pressed("interact"):
        var hud = get_tree().current_scene.get_node_or_null("HUD")
        if hud and hud.has_method("show_dialogue"):
            hud.show_dialogue(title, text)
    queue_redraw()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false

func _draw() -> void:
    if player_near:
        draw_circle(Vector2(0,-38), 5.0 + sin(pulse*5.0)*2.0, Color("#f3d26b"))

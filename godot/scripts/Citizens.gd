extends Area2D

@export var citizen_name := "Contradaiolo"
@export_multiline var dialogue: Array[String] = []
@export var contrada_color := Color("#4f7f43")
@export var accent_color := Color("#d4af37")
@export var home := Vector2.ZERO
@export var wander_radius := 80.0

var player_near := false
var target := Vector2.ZERO
var wait := 0.0
var phase := 0.0
var dialogue_index := 0
var rng := RandomNumberGenerator.new()

func _ready() -> void:
    rng.randomize()
    target = position
    home = position
    wait = rng.randf_range(1.0, 3.0)
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    $Prompt.visible = false
    queue_redraw()

func _process(delta: float) -> void:
    phase += delta
    if wait > 0.0:
        wait -= delta
    elif position.distance_to(target) < 8.0:
        target = home + Vector2(rng.randf_range(-wander_radius,wander_radius), rng.randf_range(-wander_radius,wander_radius))
        wait = rng.randf_range(1.0, 2.5)
    else:
        position = position.move_toward(target, 18.0 * delta)
    if player_near and Input.is_action_just_pressed("interact"):
        interact()
    queue_redraw()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true
        $Prompt.visible = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        $Prompt.visible = false

func interact() -> void:
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    if dialogue.is_empty():
        return
    if hud and hud.has_method("show_dialogue"):
        hud.show_dialogue(citizen_name, dialogue[dialogue_index])
    dialogue_index = (dialogue_index + 1) % dialogue.size()

func _draw() -> void:
    var bob := sin(phase * 2.0) * 1.3
    draw_ellipse(Vector2(0,28),Vector2(20,6),Color(0.03,0.02,0.015,0.30))
    draw_circle(Vector2(0,-12+bob),16,Color("#d8a16b"))
    draw_rect(Rect2(-15,3+bob,30,31),contrada_color)
    # fascia/sciarpa della Contrada
    draw_rect(Rect2(-17,7+bob,34,7),accent_color)
    draw_rect(Rect2(-12,-29+bob,24,8),accent_color)
    draw_circle(Vector2(-5,-13+bob),2.4,Color("#241914"))
    draw_circle(Vector2(5,-13+bob),2.4,Color("#241914"))
    if player_near:
        draw_arc(Vector2.ZERO,31.0+sin(phase*5.0)*2.0,-PI*0.85,-PI*0.15,18,Color(1,0.86,0.42,0.85),2)

func draw_ellipse(center: Vector2,radii: Vector2,color: Color) -> void:
    var pts := PackedVector2Array()
    for i in 20:
        var a := TAU*float(i)/20.0
        pts.append(center+Vector2(cos(a)*radii.x,sin(a)*radii.y))
    draw_colored_polygon(pts,color)

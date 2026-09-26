extends CharacterBody2D

signal nearby_interactable_changed(interactable: Area2D)
signal interaction_opened

@export var speed: float = 240.0

var facing: Vector2 = Vector2.DOWN
var is_moving := false
var animation_time := 0.0
var nearby_interactable: Area2D = null

@onready var interaction_detector: Area2D = $InteractionDetector

func _ready() -> void:
    z_index = 100
    interaction_detector.area_entered.connect(_on_area_entered)
    interaction_detector.area_exited.connect(_on_area_exited)
    queue_redraw()

func _physics_process(delta: float) -> void:
    var direction := InputManager.get_move_vector()

    if direction.length() > 1.0:
        direction = direction.normalized()

    velocity = direction * speed
    is_moving = direction.length() > 0.05

    if is_moving:
        facing = direction.normalized()
        animation_time += delta * 10.0
    else:
        animation_time = 0.0

    move_and_slide()
    GameManager.set_player_position(global_position)

    if Input.is_action_just_pressed("interact"):
        interact()

    _refresh_nearest_interactable()
    queue_redraw()

func interact() -> void:
    if is_instance_valid(nearby_interactable) and nearby_interactable.has_method("interact"):
        nearby_interactable.interact()
        interaction_opened.emit()

func _on_area_entered(area: Area2D) -> void:
    if area.is_in_group("interactable"):
        _refresh_nearest_interactable()

func _on_area_exited(area: Area2D) -> void:
    if area == nearby_interactable:
        nearby_interactable = null
        _refresh_nearest_interactable()

func _refresh_nearest_interactable() -> void:
    var best: Area2D = null
    var best_distance := INF

    for area in interaction_detector.get_overlapping_areas():
        if not area.is_in_group("interactable"):
            continue
        var distance := global_position.distance_squared_to(area.global_position)
        if distance < best_distance:
            best_distance = distance
            best = area

    if best != nearby_interactable:
        nearby_interactable = best
        nearby_interactable_changed.emit(best)

func _draw() -> void:
    var bob := sin(animation_time) * 2.0 if is_moving else 0.0
    draw_ellipse(Vector2(0, 19), Vector2(17, 6), Color(0.03, 0.02, 0.015, 0.35))
    draw_circle(Vector2(0, -10 + bob), 16, Color("#d9a56b"))
    draw_rect(Rect2(-14, 4 + bob, 28, 28), Color("#6f8f55"))
    draw_rect(Rect2(-18, -28 + bob, 36, 9), Color("#d1ad52"))
    draw_rect(Rect2(-13, -36 + bob, 26, 8), Color("#b58b31"))
    draw_circle(Vector2(-5, -11 + bob), 2.5, Color("#2a1c16"))
    draw_circle(Vector2(5, -11 + bob), 2.5, Color("#2a1c16"))
    draw_line(Vector2(-5, -2 + bob), Vector2(5, -2 + bob), Color("#8b533e"), 2.0)

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var points := PackedVector2Array()
    for i in 24:
        var angle := TAU * float(i) / 24.0
        points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
    draw_colored_polygon(points, color)

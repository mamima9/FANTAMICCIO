extends CharacterBody2D

@export var speed: float = 240.0

var facing: Vector2 = Vector2.DOWN
var is_moving := false
var animation_time := 0.0

func _ready() -> void:
    z_index = 100
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
    queue_redraw()

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

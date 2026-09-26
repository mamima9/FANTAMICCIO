extends CharacterBody2D

@export var speed := 250.0
var facing := Vector2.DOWN
var moving := false
var bob := 0.0
var step_time := 0.0
var pulse := 0.0

@onready var sprite: Sprite2D = $Sprite

func _ready() -> void:
    queue_redraw()

func _physics_process(delta: float) -> void:
    pulse += delta

    var keyboard_input := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    var mobile_input := Vector2.ZERO
    var joystick = get_tree().current_scene.get_node_or_null("MobileJoystick/JoystickSurface")
    if joystick and joystick.has_method("get_axis"):
        mobile_input = joystick.get_axis()

    var input := mobile_input if mobile_input.length() > keyboard_input.length() else keyboard_input
    velocity = input * speed
    moving = input.length() > 0.05

    if moving:
        facing = input.normalized()
        bob += delta * 12.0
        step_time += delta
        sprite.position.y = sin(bob) * 2.0
        sprite.frame = int(Time.get_ticks_msec() / 130.0) % 4
    else:
        sprite.position.y = 0.0
        sprite.frame = 0

    move_and_slide()
    global_position.x = clamp(global_position.x, 80.0, 2224.0)
    global_position.y = clamp(global_position.y, 80.0, 1216.0)
    queue_redraw()

func _draw() -> void:
    var shadow_scale := 1.0 + (sin(pulse * 4.0) * 0.04 if moving else 0.0)
    draw_ellipse(Vector2(0, 17), Vector2(15, 6) * shadow_scale, Color(0.04, 0.025, 0.015, 0.35))
    if moving:
        draw_circle(Vector2(0, -5), 19.0 + sin(pulse * 5.0) * 1.5, Color(0.82, 0.62, 0.23, 0.08))

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var points := PackedVector2Array()
    for i in 24:
        var a := TAU * float(i) / 24.0
        points.append(center + Vector2(cos(a) * radii.x, sin(a) * radii.y))
    draw_colored_polygon(points, color)

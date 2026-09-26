extends CharacterBody2D

@export var speed := 250.0
var facing := Vector2.DOWN
var moving := false
var bob := 0.0
var pulse := 0.0
var step_phase := 0.0
var last_step := 0.0

@onready var sprite: Sprite2D = $Sprite

func _ready() -> void:
    visible = true
    z_index = 100
    queue_redraw()

func _physics_process(delta: float) -> void:
    pulse += delta

    var input := Input.get_vector("move_left", "move_right", "move_up", "move_down")

    # Fallback diretto: funziona anche se il browser/Web export non ha caricato le actions.
    var keyboard := Vector2(
        float(Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT)) -
        float(Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT)),
        float(Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN)) -
        float(Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP))
    )
    if keyboard.length() > input.length():
        input = keyboard.normalized()

    var joystick = get_tree().current_scene.get_node_or_null("MobileJoystick/JoystickSurface")
    if joystick and joystick.has_method("get_axis"):
        var mobile_input: Vector2 = joystick.get_axis()
        if mobile_input.length() > input.length():
            input = mobile_input

    velocity = input * speed
    moving = input.length() > 0.05

    if moving:
        facing = input.normalized()
        bob += delta * 12.0
        step_phase += delta * 9.0
        if sin(step_phase) > 0.92 and last_step <= 0.0:
            last_step = 0.16
        last_step = max(0.0, last_step - delta)
        if is_instance_valid(sprite):
            sprite.position.y = sin(bob) * 2.0
            sprite.frame = int(Time.get_ticks_msec() / 130.0) % 4
    else:
        if is_instance_valid(sprite):
            sprite.position.y = 0.0
            sprite.frame = 0

    move_and_slide()

    # Quando trovi un ostacolo, scorri lungo il bordo invece di restare incastrato.
    if get_slide_collision_count() > 0 and input.length() > 0.05:
        velocity = velocity.slide(get_slide_collision(0).get_normal())

    global_position.x = clamp(global_position.x, 80.0, 2224.0)
    global_position.y = clamp(global_position.y, 80.0, 1216.0)
    queue_redraw()

func _draw() -> void:
    # Corpo procedurale di sicurezza: il personaggio resta visibile anche
    # se il browser tarda a caricare lo SpriteSheet SVG.
    var bob_y := sin(bob) * 2.0 if moving else 0.0
    var squash := 1.0 + (0.035 * sin(step_phase * 2.0) if moving else 0.0)
    draw_ellipse(Vector2(0, 18), Vector2(17 * squash, 6 / squash), Color(0.03,0.02,0.015,0.38))
    if moving and last_step > 0.0:
        draw_circle(Vector2(-8, 17), 2.2, Color(0.55,0.43,0.28,0.22))
        draw_circle(Vector2(8, 17), 1.6, Color(0.55,0.43,0.28,0.18))
    draw_circle(Vector2(0, -10 + bob_y), 16, Color("#d9a56b"))
    draw_rect(Rect2(-14, 4 + bob_y, 28, 28), Color("#6f8f55"))
    draw_rect(Rect2(-18, -28 + bob_y, 36, 9), Color("#d1ad52"))
    draw_rect(Rect2(-13, -36 + bob_y, 26, 8), Color("#b58b31"))
    draw_circle(Vector2(-5, -11 + bob_y), 2.5, Color("#2a1c16"))
    draw_circle(Vector2(5, -11 + bob_y), 2.5, Color("#2a1c16"))
    draw_line(Vector2(-5, -2 + bob_y), Vector2(5, -2 + bob_y), Color("#8b533e"), 2)

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var points := PackedVector2Array()
    for i in 24:
        var a := TAU * float(i) / 24.0
        points.append(center + Vector2(cos(a) * radii.x, sin(a) * radii.y))
    draw_colored_polygon(points, color)

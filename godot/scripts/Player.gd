extends CharacterBody2D

@export var speed := 250.0
var facing := Vector2.DOWN
var moving := false
var bob := 0.0
var step_time := 0.0

@onready var sprite: Sprite2D = $Sprite

func _physics_process(delta: float) -> void:
    var input := Input.get_vector("move_left", "move_right", "move_up", "move_down")
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

extends Node

## Single input layer shared by keyboard, controller and touch UI.

var joystick_vector: Vector2 = Vector2.ZERO

func set_joystick_vector(value: Vector2) -> void:
    joystick_vector = value.limit_length(1.0)

func get_move_vector() -> Vector2:
    var keyboard := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    if joystick_vector.length_squared() > keyboard.length_squared():
        return joystick_vector
    return keyboard

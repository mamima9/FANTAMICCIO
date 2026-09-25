extends Control

@export var radius := 72.0
@export var knob_radius := 30.0
@export var deadzone := 0.12
@export var margin := 34.0
@export var touch_zone_radius := 240.0

var touch_id := -1
var center := Vector2.ZERO
var knob := Vector2.ZERO
var axis := Vector2.ZERO

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    mouse_filter = Control.MOUSE_FILTER_IGNORE
    set_process_input(true)
    _reposition()
    queue_redraw()

func _notification(what: int) -> void:
    if what == NOTIFICATION_RESIZED and touch_id == -1:
        _reposition()

func _reposition() -> void:
    var size := get_viewport_rect().size
    center = Vector2(margin + radius, size.y - margin - radius)
    knob = center
    queue_redraw()

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed:
            if touch_id == -1 and event.position.distance_to(center) <= touch_zone_radius:
                touch_id = event.index
                _update_stick(event.position)
                get_viewport().set_input_as_handled()
        elif event.index == touch_id:
            _release()
            get_viewport().set_input_as_handled()
    elif event is InputEventScreenDrag and event.index == touch_id:
        _update_stick(event.position)
        get_viewport().set_input_as_handled()

func _update_stick(position: Vector2) -> void:
    var offset := position - center
    if offset.length() > radius:
        offset = offset.normalized() * radius

    var strength := offset.length() / radius
    if strength < deadzone:
        axis = Vector2.ZERO
    else:
        axis = offset.normalized() * ((strength - deadzone) / (1.0 - deadzone))

    knob = center + offset
    queue_redraw()

func _release() -> void:
    touch_id = -1
    axis = Vector2.ZERO
    knob = center
    queue_redraw()

func get_axis() -> Vector2:
    return axis

func _draw() -> void:
    draw_circle(center, radius + 8.0, Color(0.05, 0.035, 0.02, 0.32))
    draw_circle(center, radius, Color(0.12, 0.09, 0.06, 0.72))
    draw_arc(center, radius, 0.0, TAU, 48, Color(0.88, 0.70, 0.32, 0.75), 3.0)
    draw_circle(knob, knob_radius, Color(0.90, 0.70, 0.30, 0.92))
    draw_circle(knob, knob_radius - 7.0, Color(0.42, 0.25, 0.10, 0.95))

extends CanvasLayer

@export var radius := 72.0
@export var knob_radius := 30.0
@export var deadzone := 0.12
@export var margin := 34.0

var touch_id := -1
var center := Vector2.ZERO
var knob := Vector2.ZERO
var axis := Vector2.ZERO

func _ready() -> void:
    layer = 50
    process_mode = Node.PROCESS_MODE_ALWAYS
    center = Vector2(margin + radius, get_viewport().get_visible_rect().size.y - margin - radius)
    knob = center
    set_process_input(true)
    queue_redraw()

func _notification(what: int) -> void:
    if what == NOTIFICATION_RESIZED and touch_id == -1:
        center = Vector2(margin + radius, get_viewport().get_visible_rect().size.y - margin - radius)
        knob = center
        queue_redraw()

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and touch_id == -1 and event.position.distance_to(center) <= radius * 1.45:
            touch_id = event.index
            _update_stick(event.position)
            get_viewport().set_input_as_handled()
        elif not event.pressed and event.index == touch_id:
            touch_id = -1
            axis = Vector2.ZERO
            knob = center
            queue_redraw()
            get_viewport().set_input_as_handled()
    elif event is InputEventScreenDrag and event.index == touch_id:
        _update_stick(event.position)
        get_viewport().set_input_as_handled()

func _update_stick(position: Vector2) -> void:
    var offset := position - center
    if offset.length() > radius:
        offset = offset.normalized() * radius
    axis = offset / radius
    if axis.length() < deadzone:
        axis = Vector2.ZERO
    elif axis.length() > 0.0:
        axis = axis.normalized() * ((axis.length() - deadzone) / (1.0 - deadzone))
    knob = center + offset
    queue_redraw()

func get_axis() -> Vector2:
    return axis

func _process(_delta: float) -> void:
    queue_redraw()

func _draw() -> void:
    draw_circle(center, radius + 8.0, Color(0.05,0.035,0.02,0.32))
    draw_circle(center, radius, Color(0.12,0.09,0.06,0.72))
    draw_arc(center, radius, 0.0, TAU, 48, Color(0.88,0.70,0.32,0.75), 3.0)
    draw_circle(knob, knob_radius, Color(0.90,0.70,0.30,0.92))
    draw_circle(knob, knob_radius - 7.0, Color(0.42,0.25,0.10,0.95))

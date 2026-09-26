extends Control

@export var radius := 72.0
@export var knob_radius := 30.0
@export var deadzone := 0.12
@export var margin := 34.0
@export var touch_zone_radius := 250.0

var touch_id := -1
var mouse_active := false
var center := Vector2.ZERO
var knob := Vector2.ZERO
var axis := Vector2.ZERO
var mobile := false

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    mouse_filter = Control.MOUSE_FILTER_IGNORE
    mobile = _is_mobile()
    set_process_input(true)
    _reposition()
    queue_redraw()

func _is_mobile() -> bool:
    return OS.has_feature("web_android") or OS.has_feature("web_ios") or OS.has_feature("android") or OS.has_feature("ios")

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
    elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed and not mouse_active and event.position.distance_to(center) <= touch_zone_radius:
            mouse_active = true
            _update_stick(event.position)
            get_viewport().set_input_as_handled()
        elif not event.pressed and mouse_active:
            _release()
            get_viewport().set_input_as_handled()
    elif event is InputEventMouseMotion and mouse_active:
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
    mouse_active = false
    axis = Vector2.ZERO
    knob = center
    queue_redraw()

func get_axis() -> Vector2:
    return axis

func _draw() -> void:
    if not mobile and touch_id == -1 and not mouse_active:
        return
    draw_circle(center, radius + 9.0, Color(0.04,0.025,0.015,0.28))
    draw_circle(center, radius, Color(0.12,0.09,0.06,0.64))
    draw_arc(center, radius, 0.0, TAU, 48, Color(0.88,0.70,0.32,0.72), 3.0)
    draw_circle(knob, knob_radius, Color(0.90,0.70,0.30,0.94))
    draw_circle(knob, knob_radius - 7.0, Color(0.42,0.25,0.10,0.95))

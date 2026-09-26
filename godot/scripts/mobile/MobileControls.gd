extends Control

@export var radius := 78.0
@export var knob_radius := 30.0
@export var margin := 34.0
@export var deadzone := 0.12

var center := Vector2.ZERO
var knob := Vector2.ZERO
var axis := Vector2.ZERO
var touch_id := -1

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    mouse_filter = Control.MOUSE_FILTER_IGNORE
    _reposition()
    get_viewport().size_changed.connect(_reposition)
    queue_redraw()

func _reposition() -> void:
    var size := get_viewport_rect().size
    center = Vector2(margin + radius, size.y - margin - radius)
    knob = center
    queue_redraw()

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and touch_id == -1:
            if event.position.distance_to(center) <= radius * 2.2:
                touch_id = event.index
                _update_axis(event.position)
                get_viewport().set_input_as_handled()
        elif not event.pressed and event.index == touch_id:
            _release()
            get_viewport().set_input_as_handled()
    elif event is InputEventScreenDrag and event.index == touch_id:
        _update_axis(event.position)
        get_viewport().set_input_as_handled()

func _update_axis(position: Vector2) -> void:
    var offset := position - center
    if offset.length() > radius:
        offset = offset.normalized() * radius

    var strength := offset.length() / radius
    if strength < deadzone:
        axis = Vector2.ZERO
    else:
        axis = offset.normalized() * ((strength - deadzone) / (1.0 - deadzone))

    knob = center + offset
    InputManager.set_joystick_vector(axis)
    queue_redraw()

func _release() -> void:
    touch_id = -1
    axis = Vector2.ZERO
    knob = center
    InputManager.set_joystick_vector(Vector2.ZERO)
    queue_redraw()

func _draw() -> void:
    var is_mobile := OS.has_feature("android") or OS.has_feature("ios")
    if OS.has_feature("web"):
        var ua = JavaScriptBridge.eval("navigator.userAgent || ''")
        var text := str(ua).to_lower()
        is_mobile = text.contains("mobile") or text.contains("android") or text.contains("iphone") or text.contains("ipad")

    if not is_mobile and touch_id == -1:
        return

    draw_circle(center, radius + 10.0, Color(0.02, 0.02, 0.02, 0.28))
    draw_circle(center, radius, Color(0.12, 0.09, 0.06, 0.72))
    draw_arc(center, radius, 0.0, TAU, 64, Color("#e6b44d"), 3.0)
    draw_circle(knob, knob_radius, Color("#e6b44d"))
    draw_circle(knob, knob_radius - 7.0, Color("#6b421b"))

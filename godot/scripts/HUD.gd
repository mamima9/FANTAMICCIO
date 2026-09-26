extends CanvasLayer

@onready var toast: Label = $Toast
@onready var location_label: Label = $Location
@onready var objective_label: Label = $Objective
@onready var progress_label: Label = $Progress
var toast_time := 0.0
var intro_time := 0.0
var mobile_interact: Button
var mobile_fullscreen: Button


func _ready() -> void:
    toast.visible = false
    if _is_mobile():
        _setup_mobile_controls()
    if has_node("Location"):
        location_label.modulate.a = 0.96
    if has_node("Objective"):
        objective_label.modulate.a = 0.78

func _is_mobile() -> bool:
    return OS.has_feature("web_android") or OS.has_feature("web_ios") or OS.has_feature("android") or OS.has_feature("ios")

func _setup_mobile_controls() -> void:
    mobile_interact = Button.new()
    mobile_interact.name = "MobileInteract"
    mobile_interact.text = "✦\nINTERAGISCI"
    mobile_interact.visible = false
    mobile_interact.position = Vector2(0,0)
    mobile_interact.custom_minimum_size = Vector2(118,118)
    mobile_interact.add_theme_font_size_override("font_size", 15)
    mobile_interact.pressed.connect(_on_mobile_interact)
    add_child(mobile_interact)

    mobile_fullscreen = Button.new()
    mobile_fullscreen.name = "MobileFullscreen"
    mobile_fullscreen.text = "⛶"
    mobile_fullscreen.position = Vector2(0,0)
    mobile_fullscreen.custom_minimum_size = Vector2(54,54)
    mobile_fullscreen.add_theme_font_size_override("font_size", 24)
    mobile_fullscreen.pressed.connect(_toggle_fullscreen)
    add_child(mobile_fullscreen)
    _layout_mobile()

func _process(delta: float) -> void:
    if _is_mobile():
        _layout_mobile()
    if toast_time > 0.0:
        toast_time -= delta
        toast.modulate.a = min(1.0, toast_time * 2.0)
        if toast_time <= 0.0:
            toast.visible = false
            toast.modulate.a = 1.0

func _layout_mobile() -> void:
    var s := get_viewport().get_visible_rect().size
    if mobile_interact:
        mobile_interact.position = Vector2(s.x - 145.0, s.y - 150.0)
    if mobile_fullscreen:
        mobile_fullscreen.position = Vector2(s.x - 70.0, 20.0)

func set_mobile_interaction(visible: bool, label: String = "INTERAGISCI") -> void:
    if mobile_interact:
        mobile_interact.visible = visible
        mobile_interact.text = "✦\n" + label

func _on_mobile_interact() -> void:
    var main = get_tree().current_scene
    if main and main.has_method("mobile_interact"):
        main.mobile_interact()

func _toggle_fullscreen() -> void:
    if DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN:
        DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
    else:
        DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)

func set_location(location: String, objective: String) -> void:
    if has_node("Location"):
        location_label.text = location
    if has_node("Objective"):
        objective_label.text = objective

func set_progress(label: String, value: String) -> void:
    if has_node("Progress"):
        progress_label.text = label + "  " + value

func show_toast(message: String) -> void:
    toast.text = message
    toast.visible = true
    toast_time = 3.5

func show_trial_intro(trial_title: String, trial_goal: String) -> void:
    toast.text = "◆  " + trial_title + "  ◆\\n" + trial_goal + "\\n\\nPREPARATI..." 
    toast.visible = true
    toast.modulate.a = 1.0
    toast_time = 2.4

func show_dialogue(speaker: String, message: String) -> void:
    toast.text = speaker + "  •  " + message
    toast.visible = true
    toast_time = 6.0

func _process(delta: float) -> void:
    if toast_time > 0.0:
        toast_time -= delta
        toast.modulate.a = min(1.0, toast_time * 2.0)
        if toast_time <= 0.0:
            toast.visible = false
            toast.modulate.a = 1.0

extends CanvasLayer

@onready var toast: Label = $Toast
@onready var location_label: Label = $Location
@onready var objective_label: Label = $Objective
@onready var progress_label: Label = $Progress
var toast_time := 0.0
var intro_time := 0.0

func _ready() -> void:
    toast.visible = false
    if has_node("Location"):
        location_label.modulate.a = 0.96
    if has_node("Objective"):
        objective_label.modulate.a = 0.78

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

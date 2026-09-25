extends CanvasLayer

@onready var toast: Label = $Toast
var toast_time := 0.0

func show_toast(message: String) -> void:
    toast.text = message
    toast.visible = true
    toast_time = 3.0

func _process(delta: float) -> void:
    if toast_time > 0.0:
        toast_time -= delta
        if toast_time <= 0.0:
            toast.visible = false

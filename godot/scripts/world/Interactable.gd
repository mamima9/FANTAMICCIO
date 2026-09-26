extends Area2D

@export var title: String = "Luogo"
@export_multiline var text: String = "Non c'è nulla da vedere."

func _ready() -> void:
    add_to_group("interactable")
    monitoring = true
    monitorable = true

func interact() -> void:
    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(title, text)

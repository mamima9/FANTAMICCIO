extends Area2D

@export var title: String = "Luogo"
@export_multiline var text: String = "Non c'è nulla da vedere."
@export var secret_id: String = ""
@export var required_exploration_steps: int = 0

func _ready() -> void:
    add_to_group("interactable")
    monitoring = true
    monitorable = true

func get_title() -> String:
    return title

func interact() -> void:
    var progress := GameManager.exploration_progress(GameManager.current_map)
    if required_exploration_steps > 0 and progress < required_exploration_steps:
        var main := get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(title, "Prima completa le 3 tracce di esplorazione della Contrada (%d/3)." % progress)
        return

    if not secret_id.is_empty() and not GameManager.secret_discovered(secret_id):
        GameManager.discover_secret(secret_id)
        SaveManager.save_game()
        WebBridge.progress("secret_discovered", GameManager.current_map)
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(title, "SEGRETO SCOPERTO!\n\n" + text)
        return

    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        main.show_interaction(title, text)

extends Area2D

@export var npc_name := "Custode"
@export_multiline var dialogue: Array[String] = []
var player_near := false
var dialogue_index := 0

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    $Prompt.visible = false

func _process(_delta: float) -> void:
    if player_near and Input.is_action_just_pressed("interact"):
        interact()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true
        dialogue_index = 0
        $Prompt.visible = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        $Prompt.visible = false

func interact() -> void:
    if dialogue.is_empty():
        return
    var hud = get_tree().current_scene.get_node("HUD")
    if hud.has_method("show_dialogue"):
        hud.show_dialogue(npc_name, dialogue[dialogue_index])
    dialogue_index = (dialogue_index + 1) % dialogue.size()

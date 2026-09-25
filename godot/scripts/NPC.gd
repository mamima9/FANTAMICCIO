extends Area2D

@export var npc_name := "Custode"
@export_multiline var dialogue: Array[String] = []
@export var trial_id := ""
var player_near := false
var dialogue_index := 0
var ready_for_trial := false
var pulse := 0.0

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    $Prompt.visible = false
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    queue_redraw()
    if player_near and Input.is_action_just_pressed("interact"):
        interact()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true
        $Prompt.visible = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        $Prompt.visible = false

func interact() -> void:
    if ready_for_trial and trial_id != "":
        var main = get_tree().current_scene
        if main.has_method("start_trial"):
            main.start_trial(trial_id)
        return

    if dialogue.is_empty():
        return

    var hud = get_tree().current_scene.get_node("HUD")
    if hud.has_method("show_dialogue"):
        hud.show_dialogue(npc_name, dialogue[dialogue_index])

    if dialogue_index < dialogue.size() - 1:
        dialogue_index += 1
    else:
        ready_for_trial = trial_id != ""
        if ready_for_trial:
            $Prompt.text = "E  •  INIZIA PROVA"

func _draw() -> void:
    var bob := sin(pulse * 2.2) * 2.0
    draw_circle(Vector2(0, 12 + bob), 18, Color(0.10,0.07,0.04,0.35))
    draw_circle(Vector2(0, -10 + bob), 15, Color("#c99362"))
    draw_rect(Rect2(-13, 4 + bob, 26, 27), Color("#3f6f45"))
    draw_rect(Rect2(-17, -27 + bob, 34, 8), Color("#d4af37"))
    draw_rect(Rect2(-12, -35 + bob, 24, 8), Color("#b88d2f"))
    draw_circle(Vector2(-5, -12 + bob), 2.5, Color("#21150f"))
    draw_circle(Vector2(5, -12 + bob), 2.5, Color("#21150f"))
    if player_near:
        var glow := 26.0 + sin(pulse * 5.0) * 3.0
        draw_arc(Vector2.ZERO, glow, PI * 1.15, PI * 1.85, 16, Color(1,0.85,0.35,0.75), 3)

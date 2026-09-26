extends Area2D

@export var npc_name := "Custode"
@export_enum("custode","vecchio","contradaiolo") var role := "custode"
@export_multiline var dialogue: Array[String] = []
@export var trial_id := ""
@export var quest_step := -1
@export var ambient_only := false

var player_near := false
var dialogue_index := 0
var ready_for_trial := false
var pulse := 0.0
var accent := Color("#d4af37")
var idle_phase := 0.0
var talking_glow := 0.0


func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    $Prompt.visible = false
    accent = _accent_for_name()
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    idle_phase += delta
    if player_near:
        talking_glow = min(1.0, talking_glow + delta * 4.0)
    else:
        talking_glow = max(0.0, talking_glow - delta * 3.0)
    queue_redraw()
    if player_near and Input.is_action_just_pressed("interact"):
        interact()

func _accent_for_name() -> Color:
    match role:
        "vecchio":
            return Color("#a87942")
        "contradaiolo":
            return Color("#5d8d55")
        _:
            return Color("#d4af37")

func _locked_message(quest) -> String:
    if quest_step == 1 and quest.discoveries < 1:
        return "Il Vecchio aspetta che tu trovi il primo indizio nel bosco."
    if quest_step == 2 and quest.discoveries < 2:
        return "Il Contradaiolo non parla ancora. Prima segui il secondo indizio."
    return quest.get_objective()

func _on_body_entered(body: Node) -> void:
    if body.name != "Player":
        return
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    player_near = true
    if quest and quest_step >= 0 and not quest.can_talk(quest_step):
        $Prompt.text = "INDIZIO NON ANCORA DISPONIBILE"
        $Prompt.visible = true
        return
    $Prompt.visible = true
    $Prompt.text = "E  •  PARLA"

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        $Prompt.visible = false

func interact() -> void:
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    var hud = get_tree().current_scene.get_node_or_null("HUD")

    if quest and quest_step >= 0 and not quest.can_talk(quest_step):
        if hud and hud.has_method("show_toast"):
            hud.show_toast(_locked_message(quest))
        return

    if ready_for_trial and trial_id != "":
        if quest and not quest.can_start_trial(trial_id):
            if hud and hud.has_method("show_toast"):
                hud.show_toast("Mancano ancora degli indizi. Esplora il bosco.")
            return
        var main = get_tree().current_scene
        if main.has_method("start_trial"):
            main.start_trial(trial_id)
        return

    if dialogue.is_empty():
        return

    if ambient_only:
        dialogue_index = min(dialogue_index, dialogue.size() - 1)

    if dialogue_index >= dialogue.size():
        dialogue_index = dialogue.size() - 1

    if hud and hud.has_method("show_dialogue"):
        hud.show_dialogue(npc_name, dialogue[dialogue_index])

    if dialogue_index < dialogue.size() - 1:
        dialogue_index += 1
        $Prompt.text = "E  •  CONTINUA"
    else:
        if quest and quest_step >= 0:
            quest.advance()
        ready_for_trial = trial_id != ""
        if ready_for_trial:
            if quest and quest.can_start_trial(trial_id):
                $Prompt.text = "E  •  INIZIA PROVA"
            else:
                $Prompt.text = "TROVA GLI ULTIMI INDIZI"
        else:
            $Prompt.text = "INDIZIO RICEVUTO"

func _draw() -> void:
    var bob := sin(pulse * 2.2) * 2.0
    var breath := sin(idle_phase * 1.7) * 1.2
    var body_y := 4.0 + bob
    var head_y := -13.0 + bob

    draw_ellipse(Vector2(0, 27), Vector2(21, 7), Color(0.04,0.025,0.015,0.28))
    draw_circle(Vector2(0, head_y + breath), 17, Color("#d4a06b"))
    if role == "custode":
        draw_rect(Rect2(-15, body_y, 30, 31), Color("#3f6f45"))
        draw_rect(Rect2(-19, -30 + bob, 38, 9), accent)
        draw_rect(Rect2(-13, -38 + bob, 26, 9), accent.darkened(0.18))
        draw_circle(Vector2(-10, -34 + bob), 4, Color("#f2d37b"))
        draw_circle(Vector2(10, -34 + bob), 4, Color("#f2d37b"))
    elif role == "vecchio":
        draw_rect(Rect2(-15, body_y, 30, 31), Color("#79563d"))
        draw_rect(Rect2(-18, -30 + bob, 36, 10), Color("#7c593d"))
        draw_rect(Rect2(-11, -37 + bob, 22, 8), Color("#a87942"))
        draw_line(Vector2(-10, head_y + 5), Vector2(10, head_y + 5), Color("#8c6247"), 3)
        draw_line(Vector2(-8, head_y + 11), Vector2(8, head_y + 11), Color("#6d4634"), 2)
    else:
        draw_rect(Rect2(-16, body_y, 32, 31), Color("#355d3e"))
        draw_rect(Rect2(-21, -29 + bob, 42, 8), Color("#c69b3b"))
        draw_rect(Rect2(-12, -39 + bob, 24, 10), Color("#8b672e"))
        draw_line(Vector2(-9, head_y + 8), Vector2(9, head_y + 8), Color("#6b4434"), 2)

    draw_circle(Vector2(-6, head_y - 2), 2.5, Color("#21150f"))
    draw_circle(Vector2(6, head_y - 2), 2.5, Color("#21150f"))

    if player_near:
        var glow := 28.0 + sin(pulse * 5.0) * 4.0
        draw_arc(Vector2.ZERO, glow, PI * 1.12, PI * 1.88, 20, Color(1,0.86,0.42,0.85), 3)
        draw_circle(Vector2(0, -52), 3.5, Color(1,0.86,0.42,0.9))
        draw_arc(Vector2.ZERO, 36.0, -PI * 0.8, -PI * 0.2, 18, Color(1,0.88,0.5,0.28 + talking_glow * 0.5), 2)

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var points := PackedVector2Array()
    for i in 24:
        var a := TAU * float(i) / 24.0
        points.append(center + Vector2(cos(a) * radii.x, sin(a) * radii.y))
    draw_colored_polygon(points, color)

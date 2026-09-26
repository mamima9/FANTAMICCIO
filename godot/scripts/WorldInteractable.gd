extends Area2D

@export var title := "Punto d'interesse"
@export_multiline var text := "Qui c'è qualcosa da scoprire."
@export var quest_required_step := -1

var player_near := false
var pulse := 0.0
var prompt: Label

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)

    prompt = Label.new()
    prompt.text = "E  •  OSSERVA"
    prompt.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    prompt.position = Vector2(-70, -78)
    prompt.size = Vector2(140, 24)
    prompt.add_theme_color_override("font_color", Color("#f3d26b"))
    prompt.add_theme_font_size_override("font_size", 12)
    prompt.visible = false
    add_child(prompt)
    queue_redraw()

func interact() -> void:
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    if quest_required_step >= 0 and quest and quest.step < quest_required_step:
        var locked_hud = get_tree().current_scene.get_node_or_null("HUD")
        if locked_hud and locked_hud.has_method("show_toast"):
            locked_hud.show_toast("Prima segui la storia.")
        return
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    if hud and hud.has_method("show_dialogue"):
        hud.show_dialogue(title, text)

func _process(delta: float) -> void:
    pulse += delta
    if player_near:
        prompt.visible = true
        prompt.modulate.a = 0.75 + sin(pulse * 4.0) * 0.25
        if Input.is_action_just_pressed("interact"):
            var quest = get_tree().current_scene.get_node_or_null("QuestManager")
            if quest_required_step >= 0 and quest and quest.step < quest_required_step:
                var locked_hud = get_tree().current_scene.get_node_or_null("HUD")
                if locked_hud and locked_hud.has_method("show_toast"):
                    locked_hud.show_toast("Prima segui la storia.")
                return
            var hud = get_tree().current_scene.get_node_or_null("HUD")
            if hud and hud.has_method("show_dialogue"):
                hud.show_dialogue(title, text)
    queue_redraw()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        prompt.visible = false

func _draw() -> void:
    if player_near:
        draw_circle(Vector2(0,-38), 5.0 + sin(pulse*5.0)*2.0, Color("#f3d26b"))

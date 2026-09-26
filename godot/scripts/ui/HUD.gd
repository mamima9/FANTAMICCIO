extends CanvasLayer

@onready var prompt: Label = $UI/Prompt
@onready var panel: PanelContainer = $UI/Dialogue
@onready var speaker: Label = $UI/Dialogue/VBox/Speaker
@onready var body: Label = $UI/Dialogue/VBox/Body
@onready var continue_label: Label = $UI/Dialogue/VBox/Continue
@onready var interact_button: Button = $UI/InteractButton

var progress_label: Label

func _ready() -> void:
    panel.visible = false
    interact_button.visible = _is_mobile()
    get_viewport().size_changed.connect(_refresh_mobile_visibility)

    progress_label = Label.new()
    progress_label.position = Vector2(32, 86)
    progress_label.add_theme_font_size_override("font_size", 15)
    progress_label.modulate = Color(1.0, 0.96, 0.82, 0.92)
    $UI.add_child(progress_label)

func _refresh_mobile_visibility() -> void:
    interact_button.visible = _is_mobile()

func set_prompt(text: String) -> void:
    prompt.text = text

func set_map_progress(map_id: String, found: int, total: int) -> void:
    if progress_label:
        var objectives := GameManager.exploration_progress(map_id)
        var trial := "✓ Prova" if GameManager.trial_completed(map_id) else "○ Prova"
        var beniamino := "✓ Beniamino" if GameManager.has_beniamino(map_id) else "○ Beniamino"
        progress_label.text = "🔎 Esplorazione %d/3   •   ✨ Segreti %d/%d   •   %s   •   %s" % [
            objectives,
            found,
            total,
            trial,
            beniamino
        ]

func is_dialogue_open() -> bool:
    return panel.visible

func is_dialogue_open() -> bool:
    return panel.visible

func show_interaction(title: String, text: String) -> void:
    speaker.text = title
    body.text = text
    continue_label.text = "E / INTERAGISCI per chiudere"
    panel.visible = true

func close_interaction() -> void:
    panel.visible = false

func _on_interact_pressed() -> void:
    if panel.visible:
        close_interaction()
        return
    var player = get_tree().current_scene.get_node_or_null("Player")
    if player and player.has_method("interact"):
        player.interact()

func _unhandled_input(event: InputEvent) -> void:
    if panel.visible and event.is_action_pressed("interact"):
        close_interaction()

func _is_mobile() -> bool:
    if OS.has_feature("android") or OS.has_feature("ios"):
        return true
    if OS.has_feature("web"):
        var ua = JavaScriptBridge.eval("navigator.userAgent || ''")
        var text := str(ua).to_lower()
        return text.contains("mobile") or text.contains("android") or text.contains("iphone") or text.contains("ipad")
    return false

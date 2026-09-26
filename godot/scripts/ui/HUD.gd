extends CanvasLayer

@onready var prompt: Label = $UI/Prompt
@onready var panel: PanelContainer = $UI/Dialogue
@onready var speaker: Label = $UI/Dialogue/VBox/Speaker
@onready var body: Label = $UI/Dialogue/VBox/Body
@onready var continue_label: Label = $UI/Dialogue/VBox/Continue
@onready var interact_button: Button = $UI/InteractButton

func _ready() -> void:
    panel.visible = false
    interact_button.visible = _is_mobile()
    get_viewport().size_changed.connect(_refresh_mobile_visibility)

func _refresh_mobile_visibility() -> void:
    interact_button.visible = _is_mobile()

func set_prompt(text: String) -> void:
    prompt.text = text

func show_interaction(title: String, text: String) -> void:
    speaker.text = title
    body.text = text
    continue_label.text = "E / INTERAGISCI per chiudere"
    panel.visible = true

func close_interaction() -> void:
    panel.visible = false

func _on_interact_pressed() -> void:
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

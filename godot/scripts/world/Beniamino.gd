extends Area2D

@export var contrada_id := ""
@export var display_name := "Beniamino"

const ASSET_BASE_URL := "https://raw.githubusercontent.com/mamima9/FANTAMICCIO/main/public/contrade/"
var icon_request: HTTPRequest

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    _load_real_contrada_icon()
    queue_redraw()

func _load_real_contrada_icon() -> void:
    icon_request = HTTPRequest.new()
    icon_request.timeout = 10.0
    add_child(icon_request)
    icon_request.request_completed.connect(_on_icon_loaded)
    icon_request.request(ASSET_BASE_URL + contrada_id + ".png")

func _on_icon_loaded(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
    if result != HTTPRequest.RESULT_SUCCESS or response_code < 200 or response_code >= 300:
        return
    var image := Image.new()
    if image.load_png_from_buffer(body) != OK:
        return
    var texture := ImageTexture.create_from_image(image)
    var sprite := Sprite2D.new()
    sprite.texture = texture
    sprite.position = Vector2(0, -36)
    sprite.scale = Vector2(0.20, 0.20)
    sprite.z_index = 2
    add_child(sprite)
    icon_request.queue_free()
    icon_request = null
    queue_redraw()

func interact() -> void:
    if not GameManager.trial_completed(contrada_id):
        var main = get_tree().current_scene
        if main and main.has_method("show_interaction"):
            main.show_interaction(display_name, "La prova della Contrada non è ancora completata.")
        return

    if GameManager.has_beniamino(contrada_id):
        var already_main = get_tree().current_scene
        if already_main and already_main.has_method("show_interaction"):
            already_main.show_interaction(display_name, "Questo Beniamino è già nella tua collezione.")
        return

    GameManager.unlock_beniamino(contrada_id)
    SaveManager.save_game()
    WebBridge.progress("beniamino_unlocked", contrada_id)

    var total := GameManager.beniamino_count()
    var main = get_tree().current_scene
    if main and main.has_method("show_interaction"):
        if total >= 8:
            main.show_interaction(display_name, "TUTTI GLI 8 BENIAMINI RACCOLTI! Ora puoi andare alla Tregua per cercare il Barone.")
        else:
            main.show_interaction(display_name, "Hai trovato il Beniamino!\n\nCOLLEZIONE: %d/8" % total)

func _draw() -> void:
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    draw_circle(Vector2.ZERO, 32, Color(0.03, 0.02, 0.01, 0.55))
    draw_circle(Vector2.ZERO, 24, accent)
    draw_circle(Vector2(-7, -5), 3, Color("#241913"))
    draw_circle(Vector2(7, -5), 3, Color("#241913"))
    draw_arc(Vector2.ZERO, 18, 0.2, 2.9, 24, Color("#fff0c0"), 3.0)
    draw_string(ThemeDB.fallback_font, Vector2(-45, 48), "BENIAMINO", HORIZONTAL_ALIGNMENT_CENTER, 90, 11, Color("#fff0c0"))

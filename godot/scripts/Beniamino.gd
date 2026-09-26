extends Area2D

@export var beniamino_id := "quercia"
var pulse := 0.0
var collected := false
var collect_flash := 0.0

func _ready() -> void:
    visible = false
    monitoring = true
    body_entered.connect(_on_body_entered)
    queue_redraw()

func reveal() -> void:
    collected = false
    visible = true
    pulse = 0.0
    queue_redraw()

func _on_body_entered(body: Node) -> void:
    if body.name != "Player" or collected:
        return
    collected = true
    collect_flash = 1.0
    visible = true
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    if hud and hud.has_method("set_progress"):
        hud.set_progress("BENIAMINI", "1 / 8")
    if hud and hud.has_method("show_toast"):
        hud.show_toast("✦ BENIAMINO DELLA QUERCIA OTTENUTO!  +1 ✦")
    await get_tree().create_timer(0.65).timeout
    visible = false

func _process(delta: float) -> void:
    if not visible:
        return
    pulse += delta
    collect_flash = max(0.0, collect_flash - delta * 1.8)
    queue_redraw()

func _draw() -> void:
    var bob := sin(pulse * 2.4) * 4.0
    draw_circle(Vector2(0, 24), 25, Color(0.05,0.03,0.02,0.32))
    if collect_flash > 0.0:
        draw_arc(Vector2.ZERO, 35.0 + (1.0 - collect_flash) * 35.0, 0, TAU, 40, Color(1,0.88,0.45,collect_flash), 5)
    draw_circle(Vector2(0, bob), 25, Color("#d4af37"))
    draw_circle(Vector2(0, bob), 19, Color("#f4d77d"))
    draw_circle(Vector2(-7, bob-4), 4, Color("#4a3528"))
    draw_circle(Vector2(7, bob-4), 4, Color("#4a3528"))
    draw_arc(Vector2.ZERO + Vector2(0,bob), 31, -2.6, -0.55, 18, Color(1,0.9,0.45,0.9), 3)
    draw_string(ThemeDB.fallback_font, Vector2(-55, 55+bob), "BENIAMINO", HORIZONTAL_ALIGNMENT_CENTER, 110, 13, Color("#fff0b0"))

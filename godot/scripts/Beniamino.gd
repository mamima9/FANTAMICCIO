extends Area2D

@export var beniamino_id := "quercia"
var pulse := 0.0
var collected := false

func _ready() -> void:
    visible = false
    monitoring = true
    queue_redraw()

func reveal() -> void:
    collected = false
    visible = true
    pulse = 0.0
    queue_redraw()

func _process(delta: float) -> void:
    if not visible:
        return
    pulse += delta
    queue_redraw()

func _draw() -> void:
    var bob := sin(pulse * 2.4) * 4.0
    draw_circle(Vector2(0, 24), 25, Color(0.05,0.03,0.02,0.32))
    draw_circle(Vector2(0, bob), 25, Color("#d4af37"))
    draw_circle(Vector2(0, bob), 19, Color("#f4d77d"))
    draw_circle(Vector2(-7, bob-4), 4, Color("#4a3528"))
    draw_circle(Vector2(7, bob-4), 4, Color("#4a3528"))
    draw_arc(Vector2.ZERO + Vector2(0,bob), 31, -2.6, -0.55, 18, Color(1,0.9,0.45,0.9), 3)
    draw_string(ThemeDB.fallback_font, Vector2(-55, 55+bob), "BENIAMINO", HORIZONTAL_ALIGNMENT_CENTER, 110, 13, Color("#fff0b0"))

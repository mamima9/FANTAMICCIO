extends Node2D

func _ready() -> void:
    queue_redraw()

func _draw() -> void:
    var accent: Color = get_meta("accent", Color("#d6ad4d"))
    draw_circle(Vector2.ZERO, 58, Color(0.05, 0.04, 0.03, 0.32))
    draw_circle(Vector2.ZERO, 48, Color("#71685b"))
    draw_circle(Vector2.ZERO, 34, accent.darkened(0.2))
    draw_circle(Vector2.ZERO, 24, accent)
    draw_string(ThemeDB.fallback_font, Vector2(-34, 88), "PROVA", HORIZONTAL_ALIGNMENT_CENTER, 68, 16, Color(1, 0.95, 0.78, 0.9))

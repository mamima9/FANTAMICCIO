extends Node2D

func _ready() -> void:
    queue_redraw()

func _draw() -> void:
    var base: Color = get_meta("base", Color("#345c38"))
    var accent: Color = get_meta("accent", Color("#d6ad4d"))
    draw_circle(Vector2.ZERO, 35, base)
    draw_circle(Vector2(0, -18), 18, accent)
    draw_rect(Rect2(-6, 5, 12, 35), base.darkened(0.3))

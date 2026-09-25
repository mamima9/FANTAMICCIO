extends Control

func _ready() -> void:
    mouse_filter = Control.MOUSE_FILTER_IGNORE
    queue_redraw()

func _process(_delta: float) -> void:
    queue_redraw()

func _draw() -> void:
    var game = get_parent().get_parent()
    if not game or not game.active:
        return
    draw_rect(Rect2(Vector2.ZERO, size), Color("#15110d"))
    draw_rect(Rect2(35,75,690,450), Color("#30251b"), true)
    draw_rect(Rect2(35,75,690,450), Color("#d4af37"), false, 3.0)
    match game.id:
        "cervia":
            _draw_cervia(game)
        "pozzo":
            _draw_pozzo(game)
        "leondoro":
            _draw_leon(game)
        "ranocchio":
            _draw_ranocchio(game)

func _draw_player(p: Vector2, c := Color("#f5d37a")) -> void:
    draw_circle(p, 15, Color("#1c1712"))
    draw_circle(p, 12, c)
    draw_circle(p + Vector2(5,-3), 3, Color("#fff1b5"))

func _draw_cervia(g) -> void:
    for i in g.beams.size():
        var b: Rect2 = g.beams[i]
        draw_rect(b, Color("#9a5f35"), true)
        draw_line(b.position + Vector2(8,4), b.end - Vector2(8,4), Color("#d7a46a"), 3)
    draw_circle(g.lotus, 28, Color("#d4af37"))
    draw_circle(g.lotus, 17, Color("#fff0a8"))
    draw_string(ThemeDB.fallback_font, g.lotus + Vector2(-30,48), "CAMPANA", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("#f7e7b0"))
    _draw_player(g.player_pos)

func _draw_pozzo(g) -> void:
    var positions = [Vector2(160,200),Vector2(350,200),Vector2(540,200)]
    for i in positions.size():
        var selected = g.selected_clues.has(i)
        draw_circle(positions[i], 55, Color("#66533a") if selected else Color("#3f3327"))
        draw_circle(positions[i], 55, Color("#d4af37"), false, 3)
        draw_string(ThemeDB.fallback_font, positions[i] + Vector2(-25,5), str(i+1), HORIZONTAL_ALIGNMENT_LEFT, -1, 28, Color("#fff0b0"))
        draw_string(ThemeDB.fallback_font, positions[i] + Vector2(-45,82), g.clues[i], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color("#ead9a6"))
    draw_circle(Vector2(350,400), 90, Color("#111827"))
    draw_circle(Vector2(350,400), 76, Color("#26354b"))
    draw_string(ThemeDB.fallback_font, Vector2(295,405), "MISTERO", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color("#d4af37"))
    _draw_player(g.player_pos)

func _draw_leon(g) -> void:
    draw_circle(Vector2(380,300), 105, Color("#6b2e1d"))
    draw_circle(Vector2(380,300), 82, Color("#2a1812"))
    draw_circle(Vector2(380,300), 60, Color("#4a2618"))
    draw_circle(Vector2(365,285), 8, Color("#f5d37a"))
    draw_circle(Vector2(395,285), 8, Color("#f5d37a"))
    for i in g.hazards.size():
        draw_circle(g.hazards[i], 25, Color("#b53b2f"))
        draw_circle(g.hazards[i], 17, Color("#ef8b48"))
    _draw_player(g.player_pos, Color("#8fd3ff"))

func _draw_ranocchio(g) -> void:
    for i in g.lily_positions.size():
        var p: Vector2 = g.lily_positions[i]
        var alive: bool = g.lily_alive[i]
        draw_circle(p, 34, Color("#486d3b") if alive else Color("#263820"))
        if alive:
            draw_circle(p, 27, Color("#77a84f"))
            draw_line(p, p + Vector2(24,-10), Color("#b9d878"), 3)
    draw_circle(g.lotus, 35, Color("#d4af37"))
    draw_circle(g.lotus, 23, Color("#fff0a8"))
    _draw_player(g.player_pos, Color("#7ed957"))

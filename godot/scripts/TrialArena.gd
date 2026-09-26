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
        "quercia":
            _draw_quercia(game)
        "ponte":
            _draw_ponte(game)
        "madonnina":
            _draw_madonnina(game)
        "lucertola":
            _draw_lucertola(game)

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


func _draw_quercia(g) -> void:
    draw_rect(Rect2(35,75,690,450), Color("#263c27"), true)
    draw_polyline(PackedVector2Array([Vector2(60,470),Vector2(155,400),Vector2(240,380),Vector2(330,315),Vector2(430,280),Vector2(520,340),Vector2(665,125)]), Color("#9a794e"), 52, true)
    draw_polyline(PackedVector2Array([Vector2(155,400),Vector2(255,300),Vector2(365,235)]), Color("#b08c58"), 28, true)
    draw_polyline(PackedVector2Array([Vector2(365,235),Vector2(450,190),Vector2(545,355)]), Color("#8a6a46"), 30, true)
    for i in 10:
        var tree := Vector2(75.0 + float((i * 137) % 620), 105.0 + float((i * 83) % 360))
        draw_circle(tree, 27, Color("#172719"))
        draw_circle(tree + Vector2(0,-9), 21, Color("#4f7540"))
    for obstacle in g.quercia_obstacles:
        draw_rect(obstacle, Color("#543622"), true)
        draw_line(obstacle.position + Vector2(8,8), obstacle.end - Vector2(8,8), Color("#9b7047"), 3)
        draw_circle(obstacle.position + Vector2(14,5), 5, Color("#395631"))
    for i in g.golden_signs.size():
        var p: Vector2 = g.golden_signs[i]
        var pulse := 2.0 + sin(Time.get_ticks_msec()*0.006 + i) * 3.0
        draw_circle(p, 25.0 + pulse, Color(1,0.79,0.25,0.13))
        draw_circle(p, 20, Color("#d4af37") if not g.sign_found[i] else Color("#6b5520"))
        draw_circle(p, 12, Color("#fff0a8") if not g.sign_found[i] else Color("#806b38"))
        draw_string(ThemeDB.fallback_font, p + Vector2(-5,6), str(i+1), HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color("#3a2a12"))
    draw_circle(g.ancient_tree, 58, Color("#39271b"))
    draw_circle(g.ancient_tree + Vector2(0,-28), 72, Color("#4b733f"))
    draw_circle(g.ancient_tree + Vector2(-35,-15), 43, Color("#587f46"))
    draw_circle(g.ancient_tree + Vector2(34,-20), 47, Color("#3e6538"))
    draw_string(ThemeDB.fallback_font, g.ancient_tree + Vector2(-62,82), "QUERCIA ANTICA", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color("#f7e7b0"))
    draw_rect(Rect2(525,485,150,10), Color("#15120d"), true)
    draw_rect(Rect2(525,485,150 * (g.quercia_stamina / 100.0),10), Color("#d4af37"), true)
    draw_string(ThemeDB.fallback_font, Vector2(525,478), "ENERGIA", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("#f7e7b0"))
    _draw_player(g.player_pos, Color("#9fd37a"))

func _draw_ponte(g) -> void:
    draw_rect(Rect2(70,205,650,210), Color("#1c2b3a"), true)
    for i in g.bridge_tiles.size():
        var r: Rect2 = g.bridge_tiles[i]
        var safe := i >= g.bridge_index
        draw_rect(r, Color("#8b5a35") if safe else Color("#3b2b20"), true)
        draw_rect(r, Color("#d4af37"), false, 2)
        draw_string(ThemeDB.fallback_font, r.position + Vector2(20,23), str(i+1), HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("#f7e7b0"))
    _draw_player(g.player_pos, Color("#c69cff"))

func _draw_madonnina(g) -> void:
    for i in 4:
        var p := Vector2(120 + i * 150, 300)
        draw_rect(Rect2(p - Vector2(48,65), Vector2(96,130)), Color("#b58b55"), true)
        draw_rect(Rect2(p - Vector2(48,65), Vector2(96,130)), Color("#d4af37"), false, 3)
        if g.state == 1:
            var symbols = ["★","◆","●","✦"]
            draw_string(ThemeDB.fallback_font, p + Vector2(-16,10), symbols[g.memory_symbols[i]], HORIZONTAL_ALIGNMENT_LEFT, -1, 30, Color("#fff0a8"))
    if g.state == 2:
        draw_string(ThemeDB.fallback_font, Vector2(275,160), "TROVA IL SIMBOLO MEMORIZZATO", HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color("#fff0a8"))
    _draw_player(g.player_pos, Color("#e7b6ff"))

func _draw_lucertola(g) -> void:
    draw_rect(Rect2(70,180,640,250), Color("#3b4a35"), true)
    draw_line(Vector2(90,390), Vector2(350,300), Color("#c0a77a"), 34)
    draw_line(Vector2(350,300), Vector2(520,225), Color("#d8c18c"), 34)
    draw_line(Vector2(350,300), Vector2(520,390), Color("#f4e8b7"), 34)
    draw_circle(Vector2(350,300), 30, Color("#d4af37"))
    draw_string(ThemeDB.fallback_font, Vector2(315,355), "BIVIO", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color("#fff0a8"))
    draw_circle(Vector2(665,225), 32, Color("#d4af37"))
    _draw_player(g.player_pos, Color("#a8e6a1"))

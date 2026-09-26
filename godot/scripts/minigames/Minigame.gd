extends Control

signal finished(success: bool)

var contrada_id := ""
var title := ""
var instruction := ""
var progress := 0
var target := 6
var time_left := 25.0
var active := false
var mode := 0
var elapsed := 0.0
var rng := RandomNumberGenerator.new()

# Shared interaction state.
var points: Array[Vector2] = []
var used: Array[bool] = []
var sequence: Array[int] = []
var sequence_step := 0
var target_color := 0
var balance := 0.0
var round_index := 0
var target_pos := Vector2(640, 390)
var root_grid_size := Vector2i(10, 6)
var root_cell := Vector2i(0, 5)
var root_goal := Vector2i(9, 0)
var root_walls: Array[Vector2i] = []
var root_moves := 0
var root_visited: Dictionary = {}
var root_fall_message := ""
var mobile_hint_alpha := 0.0
var lizard_jump_timer := 0.0
var lizard_fire_cooldown := 0.0

const COLORS := [
    Color("#d94a45"),
    Color("#4d86c5"),
    Color("#e4bd43"),
    Color("#6ba35b")
]
const SYMBOLS := ["★", "◆", "●", "✦", "▲", "✚", "☘", "✿"]

func start(id: String) -> void:
    contrada_id = id
    var data := MapData.get_map(id)
    title = "Prova " + str(data["name"])
    mode = _mode_for(id)
    active = true
    progress = 0
    target = 6
    elapsed = 0.0
    time_left = 25.0
    round_index = 0
    balance = 0.0
    rng.randomize()
    _setup_mode()
    visible = true
    set_process(true)
    grab_focus()
    queue_redraw()

func _mode_for(id: String) -> int:
    return {
        "quercia": 0,
        "ranocchio": 1,
        "leondoro": 2,
        "lucertola": 3,
        "pozzo": 4,
        "madonnina": 5,
        "cervia": 6,
        "ponte": 7
    }.get(id, 0)

func _setup_mode() -> void:
    points.clear()
    used.clear()
    sequence.clear()
    sequence_step = 0

    match mode:
        0:
            # Puzzle a scivolamento: le radici della Quercia sostituiscono il ghiaccio.
            instruction = "Scivola tra le radici della Quercia e raggiungi il cuore dell’albero."
            root_cell = Vector2i(0, 5)
            root_goal = Vector2i(9, 0)
            root_walls = [
                Vector2i(2, 0), Vector2i(2, 1), Vector2i(2, 2), Vector2i(2, 3),
                Vector2i(4, 1), Vector2i(5, 1), Vector2i(6, 1),
                Vector2i(7, 3), Vector2i(7, 4), Vector2i(7, 5),
                Vector2i(4, 4), Vector2i(5, 4)
            ]
            root_moves = 0
            root_visited.clear()
            root_visited[root_cell] = 1
            root_fall_message = ""
            target = 999
        1:
            instruction = "Tocca quando il Ranocchio atterra sul bersaglio."
        2:
            instruction = "Colpisci il bersaglio d'oro al centro per 6 volte."
            target_pos = Vector2(640, 390)
        3:
            # Lucertola: mini livello platform/action in stile avventura 3D, adattato
            # al 2D browser: corsa, piattaforme, ostacoli e fiammate.
            instruction = "Corri con la Lucertola, salta gli ostacoli e sputa fuoco per aprirti la strada."
            target = 5
            round_index = 0
            points = [
                Vector2(250, 470), Vector2(410, 390), Vector2(575, 475),
                Vector2(735, 350), Vector2(900, 450), Vector2(1050, 330)
            ]
            used.resize(points.size())
            for i in used.size():
                used[i] = false
        4:
            instruction = "Accendi le luci seguendo la sequenza."
            for i in 6:
                sequence.append(i)
        5:
            instruction = "Abbina il colore richiesto. Hai un solo tentativo per round."
            target_color = rng.randi_range(0, COLORS.size() - 1)
        6:
            instruction = "Attraversa i checkpoint nell'ordine corretto."
            for i in target:
                points.append(Vector2(250 + i * 135, 365 + sin(i * 1.7) * 120))
        7:
            instruction = "Mantieni l'equilibrio. Usa ← → oppure tocca i lati dello schermo."
            time_left = 15.0

func _process(delta: float) -> void:
    if not active:
        return

    elapsed += delta
    time_left -= delta

    match mode:
        1:
            _update_frog()
        2:
            _update_target(delta)
        3:
            lizard_jump_timer = max(0.0, lizard_jump_timer - delta)
            lizard_fire_cooldown = max(0.0, lizard_fire_cooldown - delta)
        7:
            _update_balance(delta)

    if time_left <= 0.0 and active:
        if mode == 7 and elapsed >= 10.0 and abs(balance) < 0.75:
            _finish(true)
        else:
            _finish(false)

    queue_redraw()

func _update_frog() -> void:
    # The landing window is a short, readable rhythm moment.
    pass

func _update_target(delta: float) -> void:
    target_pos = Vector2(
        640.0 + sin(elapsed * 2.0) * 330.0,
        390.0 + cos(elapsed * 2.7) * 150.0
    )

func _update_balance(delta: float) -> void:
    var keyboard := Input.get_axis("ui_left", "ui_right")
    balance += keyboard * delta * 1.35
    balance += sin(elapsed * 1.9) * delta * 0.18
    balance = clamp(balance, -1.2, 1.2)

    if elapsed >= 10.0:
        progress = 6

func _input(event: InputEvent) -> void:
    if not active:
        return

    if mode == 3 and event.is_action_pressed("ui_accept"):
        _lizard_fire()
    elif mode == 3 and event.is_action_pressed("ui_up"):
        _lizard_jump()
    elif mode == 0 and event.is_action_pressed("ui_left"):
        _root_slide(Vector2i(-1, 0))
    elif mode == 0 and event.is_action_pressed("ui_right"):
        _root_slide(Vector2i(1, 0))
    elif mode == 0 and event.is_action_pressed("ui_up"):
        _root_slide(Vector2i(0, -1))
    elif mode == 0 and event.is_action_pressed("ui_down"):
        _root_slide(Vector2i(0, 1))
    elif event.is_action_pressed("ui_left") and mode == 7:
        balance = clamp(balance - 0.22, -1.2, 1.2)
    elif event.is_action_pressed("ui_right") and mode == 7:
        balance = clamp(balance + 0.22, -1.2, 1.2)
    elif event is InputEventKey and event.pressed and not event.echo:
        if mode == 4 and event.keycode >= KEY_1 and event.keycode <= KEY_6:
            _light_action(event.keycode - KEY_1)
        elif mode == 5 and event.keycode >= KEY_1 and event.keycode <= KEY_4:
            _color_action(event.keycode - KEY_1)

func _gui_input(event: InputEvent) -> void:
    if not active:
        return
    if event is InputEventMouseButton and event.pressed:
        _action(event.position)
    elif event is InputEventScreenTouch and event.pressed:
        _action(event.position)

func _action(position: Vector2) -> void:
    match mode:
        0:
            _root_touch_action(position)
        1:
            _frog_action()
        2:
            if position.distance_to(target_pos) <= 82.0:
                progress += 1
                if progress >= target:
                    _finish(true)
        3:
            _lizard_action(position)
        4:
            _well_action(position)
        5:
            _color_touch_action(position)
        6:
            _checkpoint_action(position)
        7:
            var half := size.x * 0.5
            balance = clamp(balance + (-0.28 if position.x < half else 0.28), -1.2, 1.2)

func _root_touch_action(position: Vector2) -> void:
    var center := Vector2(640, 595)
    var delta := position - center
    if delta.length() > 155.0:
        return
    if abs(delta.x) > abs(delta.y):
        _root_slide(Vector2i(1 if delta.x > 0 else -1, 0))
    elif abs(delta.y) > 18.0:
        _root_slide(Vector2i(0, 1 if delta.y > 0 else -1))

func _root_slide(direction: Vector2i) -> void:
    if not active or mode != 0:
        return
    var current := root_cell
    var traversed: Array[Vector2i] = []
    while true:
        var next := current + direction
        if next.x < 0 or next.x >= root_grid_size.x or next.y < 0 or next.y >= root_grid_size.y:
            break
        if root_walls.has(next):
            break
        current = next
        traversed.append(current)

    if traversed.is_empty():
        return

    # Like the classic ice-floor gym: every floor tile crossed counts.
    # Crossing any already-used tile a second time makes the floor/root give way.
    for tile in traversed:
        if tile == root_goal:
            continue
        var visits := int(root_visited.get(tile, 0)) + 1
        root_visited[tile] = visits
        if visits >= 2:
            root_fall_message = "CRACK! La radice cede... si riparte!"
            root_cell = Vector2i(0, 5)
            root_visited.clear()
            root_visited[root_cell] = 1
            root_moves = 0
            time_left = max(0.0, time_left - 2.5)
            queue_redraw()
            return

    root_cell = current
    root_moves += 1
    progress = root_moves
    if root_cell == root_goal:
        _finish(true)

func _leaf_action(position: Vector2) -> void:
    for i in points.size():
        if used[i]:
            continue
        if position.distance_to(points[i]) <= 65.0:
            used[i] = true
            progress += 1
            if progress >= target:
                _finish(true)
            return

func _frog_action() -> void:
    var phase := fmod(elapsed * 2.7, TAU)
    var landing_window := abs(sin(phase))
    if landing_window < 0.18:
        progress += 1
        if progress >= target:
            _finish(true)

func _lizard_action(position: Vector2) -> void:
    if mode != 3:
        return
    # Touching the lower-left area jumps; touching the lower-right fires.
    if position.y > size.y - 150.0:
        if position.x < size.x * 0.5:
            _lizard_jump()
        else:
            _lizard_fire()

func _lizard_fire() -> void:
    if mode != 3 or lizard_fire_cooldown > 0.0:
        return
    lizard_fire_cooldown = 0.35
    # Fire clears the next target only when the obstacle is in the fire lane.
    var nearest := -1
    var nearest_distance := INF
    for i in points.size():
        if used[i]:
            continue
        var d := abs(points[i].x - (220.0 + fmod(elapsed * 115.0, 820.0)))
        if d < nearest_distance:
            nearest_distance = d
            nearest = i
    if nearest >= 0 and nearest_distance < 180.0:
        used[nearest] = true
        progress += 1
        if progress >= target:
            _finish(true)

func _lizard_jump() -> void:
    if mode != 3:
        return
    lizard_jump_timer = 0.65
    # A jump clears the next low obstacle.
    var runner_x := 220.0 + fmod(elapsed * 115.0, 820.0)
    for i in points.size():
        if used[i]:
            continue
        if abs(points[i].x - runner_x) < 150.0 and points[i].y > 400.0:
            used[i] = true
            progress += 1
            break
    if progress >= target:
        _finish(true)

func _well_action(position: Vector2) -> void:
    for i in 6:
        var p := Vector2(425 + (i % 3) * 215, 310 + (i / 3) * 170)
        if position.distance_to(p) <= 58.0:
            _light_action(i)
            return

func _light_action(index: int) -> void:
    if sequence_step >= sequence.size():
        return
    if index == sequence[sequence_step]:
        sequence_step += 1
        progress = sequence_step
        if sequence_step >= sequence.size():
            _finish(true)
    else:
        sequence_step = 0
        progress = 0
        time_left = max(0.0, time_left - 1.5)

func _color_action(index: int) -> void:
    if index == target_color:
        progress += 1
        target_color = rng.randi_range(0, COLORS.size() - 1)
        if progress >= target:
            _finish(true)
    else:
        time_left = max(0.0, time_left - 2.0)

func _color_touch_action(position: Vector2) -> void:
    for i in COLORS.size():
        var rect := Rect2(360 + i * 145, 405, 110, 80)
        if rect.has_point(position):
            _color_action(i)
            return

func _checkpoint_action(position: Vector2) -> void:
    if progress >= points.size():
        return
    if position.distance_to(points[progress]) <= 65.0:
        progress += 1
        if progress >= target:
            _finish(true)

func _finish(success: bool) -> void:
    if not active:
        return
    active = false
    set_process(false)
    if success:
        GameManager.complete_trial(contrada_id)
        SaveManager.save_game()
        WebBridge.progress("trial_completed", contrada_id)
    finished.emit(success)

func _draw() -> void:
    if not active:
        return

    var data := MapData.get_map(contrada_id)
    var accent: Color = data["accent"]
    draw_rect(Rect2(Vector2.ZERO, size), Color(0.025, 0.018, 0.012, 0.97))
    draw_rect(Rect2(34, 28, size.x - 68, size.y - 56), Color(0.075, 0.048, 0.025, 0.99))
    draw_rect(Rect2(34, 28, size.x - 68, size.y - 56), accent, false, 3.0)

    draw_string(ThemeDB.fallback_font, Vector2(64, 78), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 30, Color("#fff1c7"))
    draw_string(ThemeDB.fallback_font, Vector2(64, 110), instruction, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(1, 0.95, 0.84, 0.92))
    draw_string(ThemeDB.fallback_font, Vector2(64, 145), "PROGRESSO %d / %d    TEMPO %02d" % [progress, target, int(ceil(time_left))], HORIZONTAL_ALIGNMENT_LEFT, -1, 17, accent)

    match mode:
        0:
            _draw_root_gym(accent)
        1:
            _draw_frog(accent)
        2:
            _draw_target(accent)
        3:
            _draw_lizard_run(accent)
        4:
            _draw_well(accent)
        5:
            _draw_colors(accent)
        6:
            _draw_checkpoints(accent)
        7:
            _draw_balance(accent)

func _draw_root_gym(accent: Color) -> void:
    # Root-gym floor: a sliding puzzle where thick oak roots stop the player.
    var board := Rect2(150, 175, 980, 330)
    draw_rect(board, Color("#1d2819"))
    draw_rect(board, Color("#6d4a28"), false, 7)

    var cell_size := Vector2(board.size.x / root_grid_size.x, board.size.y / root_grid_size.y)
    for y in root_grid_size.y:
        for x in root_grid_size.x:
            var rect := Rect2(board.position + Vector2(x, y) * cell_size, cell_size)
            draw_rect(rect, Color(0.18, 0.25, 0.15, 0.55), false, 1)

    for wall in root_walls:
        var r := Rect2(board.position + Vector2(wall.x, wall.y) * cell_size + Vector2(4, 4), cell_size - Vector2(8, 8))
        draw_rect(r, Color("#51351f"))
        draw_rect(r, Color("#8a5b2f"), false, 4)
        draw_circle(r.position + Vector2(18, 18), 7, Color("#a8753d"))
        draw_circle(r.position + Vector2(r.size.x - 18, r.size.y - 18), 5, Color("#6d4727"))

    var player_p := board.position + (Vector2(root_cell) + Vector2(0.5, 0.5)) * cell_size
    draw_circle(player_p, min(cell_size.x, cell_size.y) * 0.28, Color("#78a85a"))
    draw_circle(player_p + Vector2(-8, -8), 6, Color("#dce7a0"))
    draw_circle(player_p + Vector2(8, -8), 6, Color("#dce7a0"))
    draw_circle(player_p + Vector2(-8, -8), 2.5, Color("#1c2417"))
    draw_circle(player_p + Vector2(8, -8), 2.5, Color("#1c2417"))

    var goal_p := board.position + (Vector2(root_goal) + Vector2(0.5, 0.5)) * cell_size
    draw_circle(goal_p, min(cell_size.x, cell_size.y) * 0.34, Color("#d9b94a", 0.9))
    draw_circle(goal_p, min(cell_size.x, cell_size.y) * 0.22, Color("#6f9c4e"))
    draw_string(ThemeDB.fallback_font, goal_p + Vector2(-35, 6), "♥", HORIZONTAL_ALIGNMENT_CENTER, 70, 24, Color("#fff1c7"))

    draw_string(ThemeDB.fallback_font, Vector2(395, 540), "←  ↑  ↓  →   SCIVOLA TRA LE RADICI", HORIZONTAL_ALIGNMENT_CENTER, 490, 19, Color("#fff1c7"))
    # Touch D-pad: the puzzle remains fully playable without a physical keyboard.
    var cx := 640.0
    var cy := 595.0
    var btn := 52.0
    for item in [
        [Vector2(cx, cy - 58), "↑"],
        [Vector2(cx, cy + 58), "↓"],
        [Vector2(cx - 58, cy), "←"],
        [Vector2(cx + 58, cy), "→"]
    ]:
        var bp: Vector2 = item[0]
        draw_circle(bp, btn * 0.5, Color(0.05, 0.035, 0.02, 0.9))
        draw_circle(bp, btn * 0.5, accent, false, 3.0)
        draw_string(ThemeDB.fallback_font, bp + Vector2(-10, 9), str(item[1]), HORIZONTAL_ALIGNMENT_CENTER, 20, 22, Color("#fff1c7"))
    draw_string(ThemeDB.fallback_font, Vector2(410, 670), "PASSA UNA VOLTA SOLA SU OGNI RADICE", HORIZONTAL_ALIGNMENT_CENTER, 460, 15, Color(1, 0.95, 0.82, 0.85))
    if not root_fall_message.is_empty():
        draw_string(ThemeDB.fallback_font, Vector2(390, 615), root_fall_message, HORIZONTAL_ALIGNMENT_CENTER, 500, 19, Color("#e4bd43"))

func _draw_frog(accent: Color) -> void:
    var phase := fmod(elapsed * 2.7, TAU)
    var jump := max(0.0, sin(phase))
    var p := Vector2(640, 430 - jump * 170)
    draw_circle(Vector2(640, 455), 55, Color(accent, 0.15))
    draw_ellipse(p + Vector2(0, 10), Vector2(54, 34), Color("#62a55f"))
    draw_circle(p + Vector2(-24, -18), 15, Color("#83bd6e"))
    draw_circle(p + Vector2(24, -18), 15, Color("#83bd6e"))
    draw_circle(p + Vector2(-24, -18), 5, Color("#1d2116"))
    draw_circle(p + Vector2(24, -18), 5, Color("#1d2116"))
    draw_arc(Vector2(640, 455), 70, 0, TAU, 40, accent, 4)
    draw_string(ThemeDB.fallback_font, Vector2(530, 545), "TOCCA QUANDO ATTERRA", HORIZONTAL_ALIGNMENT_CENTER, 220, 17, Color("#fff1c7"))

func _draw_target(accent: Color) -> void:
    draw_circle(target_pos, 105, Color(accent, 0.10))
    draw_circle(target_pos, 76, Color("#d6ad4d"))
    draw_circle(target_pos, 51, Color("#fff0bf"))
    draw_circle(target_pos, 27, Color("#a8392f"))
    draw_string(ThemeDB.fallback_font, target_pos + Vector2(-70, 145), "COLPISCI", HORIZONTAL_ALIGNMENT_CENTER, 140, 16, Color("#fff1c7"))

func _draw_lizard_run(accent: Color) -> void:
    # Side-scrolling adventure layout: platforms, crates, hazards and fire targets.
    draw_rect(Rect2(120, 200, 1040, 350), Color("#182019"))
    draw_rect(Rect2(120, 510, 1040, 40), Color("#51351f"))
    draw_line(Vector2(120, 510), Vector2(1160, 510), accent, 5)

    for i in points.size():
        var p := points[i]
        if used[i]:
            continue
        draw_rect(Rect2(p - Vector2(45, 18), Vector2(90, 36)), Color("#8a5b2f"))
        draw_rect(Rect2(p - Vector2(45, 18), Vector2(90, 36)), Color("#d39a4c"), false, 4)
        draw_circle(p + Vector2(0, -40), 16, Color("#d94a45"))
        draw_circle(p + Vector2(0, -40), 7, Color("#ffd35c"))

    var lizard := Vector2(220 + fmod(elapsed * 115.0, 820.0), 450)
    var bob := sin(elapsed * 8.0) * 5.0
    lizard.y += bob
    if lizard_jump_timer > 0.0:
        lizard.y -= 105.0 * min(1.0, lizard_jump_timer / 0.65)
    draw_ellipse(lizard, Vector2(48, 27), Color("#79a95a"))
    draw_circle(lizard + Vector2(35, -18), 20, Color("#91c36c"))
    draw_circle(lizard + Vector2(40, -21), 5, Color("#1c2417"))
    draw_line(lizard + Vector2(-40, 20), lizard + Vector2(-62, 34), Color("#79a95a"), 9)

    # Fire breath.
    var flame := lizard + Vector2(62, -6)
    draw_colored_polygon(PackedVector2Array([
        flame, flame + Vector2(70, -24), flame + Vector2(98, 0),
        flame + Vector2(70, 24)
    ]), Color("#e4bd43"))
    draw_circle(flame + Vector2(35, 0), 14, Color("#fff0a8"))

    draw_rect(Rect2(120, 565, 250, 78), Color(0.04, 0.03, 0.02, 0.88))
    draw_rect(Rect2(910, 565, 250, 78), Color(0.04, 0.03, 0.02, 0.88))
    draw_rect(Rect2(120, 565, 250, 78), accent, false, 3)
    draw_rect(Rect2(910, 565, 250, 78), accent, false, 3)
    draw_string(ThemeDB.fallback_font, Vector2(150, 613), "SALTA", HORIZONTAL_ALIGNMENT_CENTER, 190, 22, Color("#fff1c7"))
    draw_string(ThemeDB.fallback_font, Vector2(940, 613), "🔥 FUOCO", HORIZONTAL_ALIGNMENT_CENTER, 190, 22, Color("#fff1c7"))
    draw_string(ThemeDB.fallback_font, Vector2(390, 620), "↑ / TAP SINISTRA     SPAZIO / TAP DESTRA", HORIZONTAL_ALIGNMENT_CENTER, 500, 16, Color("#fff1c7"))

func _draw_well(accent: Color) -> void:
    draw_circle(Vector2(640, 390), 105, Color("#252c36"))
    draw_circle(Vector2(640, 390), 75, Color("#111820"))
    for i in 6:
        var p := Vector2(425 + (i % 3) * 215, 310 + (i / 3) * 170)
        var lit := i == sequence[sequence_step] if sequence_step < sequence.size() else false
        draw_circle(p, 48, Color("#f4d86a", 0.9) if lit else Color("#4a4b49"))
        draw_circle(p, 31, Color("#fff1b0") if lit else Color("#222524"))
        draw_string(ThemeDB.fallback_font, p + Vector2(-8, 7), str(i + 1), HORIZONTAL_ALIGNMENT_CENTER, 16, 17, Color("#261b12"))

func _draw_colors(accent: Color) -> void:
    draw_string(ThemeDB.fallback_font, Vector2(520, 255), "ABBINA QUESTO COLORE", HORIZONTAL_ALIGNMENT_CENTER, 240, 18, Color("#fff1c7"))
    draw_rect(Rect2(605, 285, 70, 70), COLORS[target_color])
    for i in COLORS.size():
        var rect := Rect2(360 + i * 145, 405, 110, 80)
        draw_rect(rect, COLORS[i])
        draw_string(ThemeDB.fallback_font, Vector2(rect.position.x, rect.position.y + 110), str(i + 1), HORIZONTAL_ALIGNMENT_CENTER, 110, 16, Color("#fff1c7"))

func _draw_checkpoints(accent: Color) -> void:
    for i in points.size():
        var active_point := i == progress
        draw_circle(points[i], 44 if active_point else 28, Color(accent, 0.20))
        draw_circle(points[i], 26 if active_point else 16, accent if active_point else Color("#66513b"))
        draw_string(ThemeDB.fallback_font, points[i] + Vector2(-7, 7), str(i + 1), HORIZONTAL_ALIGNMENT_CENTER, 14, 15, Color("#fff5d8"))
        if i < points.size() - 1:
            draw_line(points[i], points[i + 1], Color(1, 0.9, 0.7, 0.3), 4)

func _draw_balance(accent: Color) -> void:
    var bar := Rect2(220, 365, 840, 48)
    draw_rect(bar, Color("#2d241a"))
    draw_rect(Rect2(500, 365, 280, 48), Color("#527b4e", 0.45))
    var marker_x := 640.0 + balance * 420.0
    draw_circle(Vector2(marker_x, 389), 24, accent)
    draw_circle(Vector2(marker_x, 389), 10, Color("#fff2c8"))
    draw_string(ThemeDB.fallback_font, Vector2(420, 500), "← SINISTRA       DESTRA →", HORIZONTAL_ALIGNMENT_CENTER, 440, 18, Color("#fff1c7"))

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var polygon := PackedVector2Array()
    for i in 24:
        var angle := TAU * float(i) / 24.0
        polygon.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
    draw_colored_polygon(polygon, color)

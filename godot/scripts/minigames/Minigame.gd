extends Control

signal finished(success: bool)

var contrada_id := ""
var title := ""
var instruction := ""
var progress := 0
var target := 6
var time_left := 18.0
var active := false
var mode := 0
var pulse := 0.0
var target_pos := Vector2(0.5, 0.55)

func start(id: String) -> void:
    contrada_id = id
    var data := MapData.get_map(id)
    title = "Prova " + str(data["name"])
    mode = _mode_for(id)
    progress = 0
    target = 6
    time_left = 18.0
    active = true
    instruction = _instruction_for(mode)
    visible = true
    set_process(true)
    queue_redraw()

func _mode_for(id: String) -> int:
    var modes := {"quercia": 0, "ranocchio": 1, "leondoro": 2, "lucertola": 3, "pozzo": 4, "madonnina": 5, "cervia": 6, "ponte": 7}
    return modes.get(id, 0)

func _instruction_for(value: int) -> String:
    var texts := [
        "Raccogli 6 foglie prima che scada il tempo.",
        "Segui il ritmo: fai 6 salti.",
        "Colpisci il bersaglio 6 volte.",
        "Trova 6 simboli nascosti.",
        "Attiva 6 luci del pozzo.",
        "Abbina 6 colori nel minor tempo possibile.",
        "Supera 6 checkpoint.",
        "Mantieni l'equilibrio per 6 secondi."
    ]
    return texts[value]

func _process(delta: float) -> void:
    if not active:
        return
    time_left -= delta
    pulse += delta
    target_pos = Vector2(
        0.5 + sin(pulse * (1.2 + mode * 0.1)) * 0.28,
        0.53 + cos(pulse * (1.0 + mode * 0.08)) * 0.18
    )
    if time_left <= 0.0:
        _finish(false)
    queue_redraw()

func _gui_input(event: InputEvent) -> void:
    if not active:
        return
    if event is InputEventMouseButton and event.pressed:
        _action(event.position)
    elif event is InputEventScreenTouch and event.pressed:
        _action(event.position)

func _action(position: Vector2) -> void:
    var size := size
    var center := Vector2(size.x * target_pos.x, size.y * target_pos.y)

    var hit_radius := 100.0
    if mode == 1:
        hit_radius = 150.0
    elif mode == 7:
        hit_radius = 125.0

    if position.distance_to(center) <= hit_radius:
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
        WebBridge.progress("trial_completed", contrada_id)
    finished.emit(success)

func _draw() -> void:
    if not active:
        return

    var data := MapData.get_map(contrada_id)
    var accent: Color = data["accent"]

    draw_rect(Rect2(Vector2.ZERO, size), Color(0.025, 0.02, 0.015, 0.96))
    draw_rect(Rect2(40, 35, size.x - 80, size.y - 70), Color(0.08, 0.055, 0.035, 0.98))
    draw_rect(Rect2(40, 35, size.x - 80, size.y - 70), accent, false, 3.0)

    draw_string(ThemeDB.fallback_font, Vector2(70, 90), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 30, Color("#fff1c7"))
    draw_string(ThemeDB.fallback_font, Vector2(70, 125), instruction, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(1, 0.95, 0.84, 0.9))
    draw_string(ThemeDB.fallback_font, Vector2(70, 160), "Progressi: %d / %d    Tempo: %02d" % [progress, target, int(ceil(time_left))], HORIZONTAL_ALIGNMENT_LEFT, -1, 17, accent)

    var center := Vector2(size.x * target_pos.x, size.y * target_pos.y)
    draw_circle(center, 100, Color(accent, 0.12))
    draw_circle(center, 62, Color(accent, 0.26))
    draw_circle(center, 36, accent)
    draw_circle(center, 18, Color("#fff2c8"))

    draw_string(ThemeDB.fallback_font, Vector2(size.x / 2 - 80, size.y - 80), "TOCCA / CLICCA IL BERSAGLIO", HORIZONTAL_ALIGNMENT_CENTER, 160, 14, Color(1, 0.92, 0.72, 0.85))

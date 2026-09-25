extends CanvasLayer
## Real mini-game controller for all eight Beniamini trials.
## Each trial has its own mechanic; this is the gameplay layer, not a placeholder timer.

signal won(id: String)
signal failed(id: String)

var active := false
var id := ""
var elapsed := 0.0
var time_limit := 0.0
var player_pos := Vector2.ZERO
var player_velocity := Vector2.ZERO
var state := 0
var score := 0
var target := 0
var danger_timer := 0.0
var flash_timer := 0.0
var rng := RandomNumberGenerator.new()

var clues: Array[String] = []
var clue_order: Array[int] = []
var selected_clues: Array[int] = []
var lily_positions: Array[Vector2] = []
var lily_alive: Array[bool] = []
var beams: Array[Rect2] = []
var hazards: Array[Vector2] = []
var hazard_vel: Array[Vector2] = []
var lotus := Vector2.ZERO
var golden_signs: Array[Vector2] = []
var sign_found: Array[bool] = []
var ancient_tree := Vector2.ZERO
var bridge_tiles: Array[Rect2] = []
var bridge_index := 0
var memory_symbols: Array[int] = []
var route_fork := 0
var memory_target_slot := 0

@onready var root: Control = $Root
@onready var title: Label = $Root/Panel/Title
@onready var objective: Label = $Root/Panel/Objective
@onready var timer_label: Label = $Root/Panel/Timer
@onready var message: Label = $Root/Panel/Message
@onready var arena: Control = $Root/Arena
@onready var retry_button: Button = $Root/Panel/Retry

func _ready() -> void:
    rng.randomize()
    root.visible = false
    retry_button.pressed.connect(_retry)

func start(trial_id: String) -> void:
    id = trial_id
    active = true
    elapsed = 0.0
    score = 0
    state = 0
    danger_timer = 0.0
    flash_timer = 0.0
    player_velocity = Vector2.ZERO
    retry_button.visible = false
    root.visible = true
    _setup_trial()
    queue_redraw()

func _setup_trial() -> void:
    match id:
        "cervia":
            time_limit = 75.0
            target = 1
            title.text = "LA TORRE DI BELTRAME"
            objective.text = "Sali evitando le travi. Raggiungi la campana."
            message.text = "Muoviti con WASD / FRECCE"
            player_pos = Vector2(160, 500)
            beams = [
                Rect2(90, 410, 240, 24), Rect2(250, 320, 230, 24),
                Rect2(100, 230, 260, 24), Rect2(330, 145, 250, 24)
            ]
            lotus = Vector2(590, 95)
        "pozzo":
            time_limit = 120.0
            target = 3
            title.text = "IL MISTERO DEL MICCIO"
            objective.text = "Trova le tre tracce e ricostruisci l'ordine."
            message.text = "Esamina le tracce nell'ordine corretto."
            player_pos = Vector2(350, 470)
            clues = ["ACQUA", "PIETRA", "MICCIO"]
            clue_order = [0, 1, 2]
        "leondoro":
            time_limit = 30.0
            target = 30
            title.text = "LA TANA DEL LEONE"
            objective.text = "Sopravvivi 30 secondi senza farti colpire."
            message.text = "Continua a muoverti e cambia direzione."
            player_pos = Vector2(350, 300)
            hazards.clear()
            hazard_vel.clear()
            for i in range(5):
                hazards.append(Vector2(120 + rng.randf_range(0, 460), 130 + rng.randf_range(0, 340)))
                hazard_vel.append(Vector2.from_angle(rng.randf_range(0.0, TAU)) * rng.randf_range(90.0, 150.0))
        "quercia":
            time_limit = 90.0
            target = 3
            title.text = "LA CORSA TRA LE QUERCE"
            objective.text = "Trova i 3 segni dorati e raggiungi la Quercia Antica."
            message.text = "Il sentiero più corto non è quello giusto."
            player_pos = Vector2(80, 470)
            golden_signs = [Vector2(180,390), Vector2(360,250), Vector2(540,360)]
            sign_found = [false, false, false]
            ancient_tree = Vector2(650,140)
        "ponte":
            time_limit = 55.0
            target = 1
            title.text = "IL PONTE DI TAVOLE"
            objective.text = "Attraversa le tavole seguendo il ritmo sicuro."
            message.text = "Scegli la tavola sicura in ogni passo."
            player_pos = Vector2(80,300)
            bridge_index = 0
            bridge_tiles = []
            for i in 9:
                bridge_tiles.append(Rect2(100 + i * 65, 250 + ((i % 3) - 1) * 45, 52, 34))
        "madonnina":
            time_limit = 90.0
            target = 1
            title.text = "IL PAGLIAIO PERDUTO"
            objective.text = "Memorizza il simbolo e ritrovalo tra i covoni."
            message.text = "Osserva il simbolo: sparirà presto."
            player_pos = Vector2(350,460)
            memory_symbols.clear()
            for i in 4:
                memory_symbols.append(i)
            memory_target_slot = rng.randi_range(0, 3)
            state = 1
        "lucertola":
            time_limit = 75.0
            target = 1
            title.text = "LA VIA DELLA RIPA"
            objective.text = "Raggiungi il bivio e scegli la strada indicata dalle pietre."
            message.text = "La strada più luminosa è un inganno."
            player_pos = Vector2(90,450)
            route_fork = 0
        "ranocchio":
            time_limit = 60.0
            target = 1
            title.text = "IL LOTO D'ORO"
            objective.text = "Salta sulle ninfee senza cadere e raggiungi il loto."
            message.text = "Le ninfee affondano dopo il salto."
            player_pos = Vector2(80, 440)
            lily_positions = [
                Vector2(130,400),Vector2(220,330),Vector2(315,390),
                Vector2(410,285),Vector2(500,350),Vector2(600,250)
            ]
            lily_alive = []
            for p in lily_positions:
                lily_alive.append(true)
            lotus = Vector2(660, 145)
    arena.queue_redraw()

func _process(delta: float) -> void:
    if not active:
        return
    elapsed += delta
    flash_timer = max(0.0, flash_timer - delta)
    if id == "leondoro":
        _update_leon(delta)
    elif id == "cervia":
        _update_cervia(delta)
    elif id == "ranocchio":
        _update_ranocchio(delta)
    elif id == "pozzo":
        _update_pozzo(delta)
    elif id == "quercia":
        _update_quercia(delta)
    elif id == "ponte":
        _update_ponte(delta)
    elif id == "madonnina":
        _update_madonnina(delta)
    elif id == "lucertola":
        _update_lucertola(delta)
    timer_label.text = "TEMPO  %02d" % max(0, int(ceil(time_limit - elapsed)))
    arena.queue_redraw()
    if elapsed >= time_limit and active:
        _fail("Tempo scaduto.")

func _input(event: InputEvent) -> void:
    if not active:
        return
    if event is InputEventKey and event.pressed and not event.echo:
        if event.keycode == KEY_ESCAPE:
            _fail("Hai abbandonato la prova.")
            return
        if id == "pozzo" and event.keycode >= KEY_1 and event.keycode <= KEY_3:
            _select_clue(event.keycode - KEY_1)
    if event is InputEventMouseButton and event.pressed:
        var p := arena.get_local_mouse_position()
        if id == "pozzo":
            _click_clue(p)
        elif id == "ranocchio":
            _jump_to_lily(p)
        elif id == "ponte":
            _bridge_click(p)
        elif id == "madonnina":
            _memory_click(p)
        elif id == "lucertola":
            _route_click(p)

func _movement() -> Vector2:
    var v := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    var joystick = get_tree().current_scene.get_node_or_null("MobileJoystick/JoystickSurface")
    if joystick and joystick.has_method("get_axis"):
        var j := joystick.get_axis()
        if j.length() > v.length():
            v = j
    if v.length() > 1.0:
        v = v.normalized()
    return v

func _update_cervia(delta: float) -> void:
    var v := _movement()
    if v.length() > 0.05:
        player_pos += v * 190.0 * delta
    player_pos.x = clamp(player_pos.x, 45.0, 700.0)
    player_pos.y = clamp(player_pos.y, 80.0, 510.0)
    for beam in beams:
        if Rect2(beam.position - Vector2(8,8), beam.size + Vector2(16,16)).has_point(player_pos):
            player_pos.y = min(510.0, beam.end.y + 28.0)
    if player_pos.distance_to(lotus) < 48.0:
        _win()

func _update_leon(delta: float) -> void:
    var v := _movement()
    player_pos += v * 230.0 * delta
    player_pos.x = clamp(player_pos.x, 55.0, 705.0)
    player_pos.y = clamp(player_pos.y, 85.0, 505.0)
    danger_timer += delta
    for i in hazards.size():
        hazards[i] += hazard_vel[i] * delta
        if hazards[i].x < 45 or hazards[i].x > 715:
            hazard_vel[i].x *= -1
        if hazards[i].y < 85 or hazards[i].y > 505:
            hazard_vel[i].y *= -1
        if hazards[i].distance_to(player_pos) < 32.0:
            _fail("Il Leone ti ha raggiunto.")
            return
    if elapsed >= 30.0:
        _win()

func _update_quercia(delta: float) -> void:
    var v := _movement()
    player_pos += v * 190.0 * delta
    player_pos.x = clamp(player_pos.x, 45.0, 700.0)
    player_pos.y = clamp(player_pos.y, 80.0, 510.0)
    for i in golden_signs.size():
        if not sign_found[i] and player_pos.distance_to(golden_signs[i]) < 42.0:
            sign_found[i] = true
            score += 1
            message.text = "Segno dorato %d/3 trovato." % score
    if score == 3 and player_pos.distance_to(ancient_tree) < 55.0:
        _win()

func _update_ponte(delta: float) -> void:
    if bridge_index >= bridge_tiles.size():
        _win()
        return
    var v := _movement()
    player_pos += v * 185.0 * delta
    player_pos.x = clamp(player_pos.x, 45.0, 700.0)
    player_pos.y = clamp(player_pos.y, 80.0, 510.0)
    if bridge_tiles[bridge_index].grow(18).has_point(player_pos):
        bridge_index += 1
        message.text = "Tavola sicura! %d/9" % bridge_index
    if bridge_index < bridge_tiles.size() and player_pos.x > bridge_tiles[bridge_index].end.x + 30.0:
        _fail("La tavola è crollata.")

func _update_madonnina(_delta: float) -> void:
    if state == 1 and elapsed > 4.0:
        state = 2
        message.text = "Ora è nascosto. Trova il simbolo che hai memorizzato."

func _update_lucertola(delta: float) -> void:
    var v := _movement()
    player_pos += v * 180.0 * delta
    player_pos.x = clamp(player_pos.x, 45.0, 700.0)
    player_pos.y = clamp(player_pos.y, 80.0, 510.0)
    if route_fork == 0 and player_pos.x > 330.0:
        route_fork = 1
        message.text = "BIVIO! Le pietre indicano la strada meno luminosa."
    elif route_fork == 2 and player_pos.x > 660.0:
        _win()

func _update_ranocchio(_delta: float) -> void:
    if player_pos.distance_to(lotus) < 45.0:
        _win()

func _update_pozzo(_delta: float) -> void:
    if selected_clues.size() == 3:
        _win()

func _jump_to_lily(point: Vector2) -> void:
    var nearest := -1
    var best := 9999.0
    for i in lily_positions.size():
        if not lily_alive[i]:
            continue
        var d := point.distance_to(lily_positions[i])
        if d < best:
            best = d
            nearest = i
    if nearest < 0 or best > 70.0:
        return
    if player_pos.distance_to(lily_positions[nearest]) > 125.0:
        message.text = "Troppo lontana. Cerca la prossima ninfea."
        return
    player_pos = lily_positions[nearest]
    lily_alive[nearest] = false
    message.text = "La ninfea affonda! Continua!"
    if nearest == lily_positions.size() - 1:
        player_pos = lotus

func _bridge_click(point: Vector2) -> void:
    if bridge_index >= bridge_tiles.size():
        return
    if bridge_tiles[bridge_index].grow(45).has_point(point):
        bridge_index += 1
        message.text = "Tavola sicura! %d/9" % bridge_index
    elif point.x > 80.0:
        _fail("Hai scelto una tavola instabile.")

func _memory_click(point: Vector2) -> void:
    if state != 2:
        return
    var slot := int(clamp(floor((point.x - 100.0) / 150.0), 0.0, 3.0))
    if slot == memory_target_slot:
        _win()
    else:
        _fail("Simbolo sbagliato.")

func _route_click(point: Vector2) -> void:
    if route_fork != 1:
        return
    if point.x < 520.0:
        _fail("La strada più luminosa era l'inganno.")
    else:
        route_fork = 2
        message.text = "La pietra giusta! Continua."

func _click_clue(point: Vector2) -> void:
    var positions = [Vector2(160,200),Vector2(350,200),Vector2(540,200)]
    for i in positions.size():
        if point.distance_to(positions[i]) < 65.0:
            _select_clue(i)
            return

func _select_clue(index: int) -> void:
    if selected_clues.has(index):
        return
    if index != selected_clues.size():
        message.text = "Questa traccia non viene ancora. Segui la storia."
        flash_timer = 0.5
        return
    selected_clues.append(index)
    message.text = "Traccia %d/3 corretta." % selected_clues.size()

func _retry() -> void:
    start(id)

func _win() -> void:
    if not active:
        return
    active = false
    message.text = "PROVA SUPERATA! Il Beniamino ti aspetta."
    retry_button.visible = false
    won.emit(id)
    await get_tree().create_timer(1.4).timeout
    root.visible = false

func _fail(reason: String) -> void:
    if not active:
        return
    active = false
    message.text = reason + "  Riprova."
    retry_button.visible = true
    failed.emit(id)


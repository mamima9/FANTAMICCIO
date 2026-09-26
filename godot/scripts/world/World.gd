extends Node2D

signal map_changed(map_id: String)
signal nearby_interactable_changed(interactable: Area2D)

const WORLD_SIZE := Vector2(1280, 720)
const EXIT_SIZE := 80.0

var current_map_id := "quercia"
var current_data: Dictionary = {}
var map_nodes := Node2D.new()
var collision_nodes := Node2D.new()
var exit_nodes := Node2D.new()
var hotspot_nodes := Node2D.new()
var has_background := false

@onready var player: CharacterBody2D = get_parent().get_node("Player")

func _ready() -> void:
    add_child(map_nodes)
    add_child(collision_nodes)
    add_child(exit_nodes)
    add_child(hotspot_nodes)
    load_map(GameManager.current_map)

func load_map(map_id: String, entry_direction: String = "") -> void:
    if not MapData.MAPS.has(map_id):
        map_id = "quercia"
    current_map_id = map_id
    current_data = MapData.get_map(map_id)
    has_background = false
    GameManager.set_map(map_id)
    _clear_world()
    _build_background()
    _build_boundaries()
    _build_exits()
    _build_map_collision()
    _build_map_interaction()
    _build_beniamino()
    _build_map_hotspots()
    _build_map_objectives()
    _build_dynamic_event()
    player.global_position = _spawn_for_entry(entry_direction)
    map_changed.emit(map_id)
    WebBridge.progress("map_changed", map_id)
    queue_redraw()

func _build_background() -> void:
    # Authored top-down map artwork. Gameplay objects remain separate so
    # quest logic can evolve without destroying the visual world.
    var path := "res://art/maps/%s.svg" % current_map_id
    var texture := load(path) as Texture2D
    if texture == null:
        has_background = false
        return

    var background := Sprite2D.new()
    background.texture = texture
    background.position = Vector2.ZERO
    background.centered = false
    background.z_index = -100
    background.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    map_nodes.add_child(background)
    has_background = true

func _clear_world() -> void:
    for child in map_nodes.get_children():
        child.queue_free()
    for child in collision_nodes.get_children():
        child.queue_free()
    for child in exit_nodes.get_children():
        child.queue_free()
    for child in hotspot_nodes.get_children():
        child.queue_free()

func _spawn_for_entry(entry_direction: String) -> Vector2:
    match entry_direction:
        "up": return Vector2(640, 100)
        "down": return Vector2(640, 620)
        "left": return Vector2(110, 360)
        "right": return Vector2(1170, 360)
        _: return current_data["spawn"]

func _add_wall(position: Vector2, size: Vector2) -> void:
    var body := StaticBody2D.new()
    body.collision_layer = 1
    body.collision_mask = 1
    var shape_node := CollisionShape2D.new()
    var shape := RectangleShape2D.new()
    shape.size = size
    shape_node.shape = shape
    body.position = position
    body.add_child(shape_node)
    collision_nodes.add_child(body)

func _build_boundaries() -> void:
    _add_wall(Vector2(160, -15), Vector2(320, 30))
    _add_wall(Vector2(1120, -15), Vector2(320, 30))
    _add_wall(Vector2(160, 735), Vector2(320, 30))
    _add_wall(Vector2(1120, 735), Vector2(320, 30))
    _add_wall(Vector2(-15, 90), Vector2(30, 180))
    _add_wall(Vector2(-15, 630), Vector2(30, 180))
    _add_wall(Vector2(1295, 90), Vector2(30, 180))
    _add_wall(Vector2(1295, 630), Vector2(30, 180))

func _build_map_collision() -> void:
    match current_map_id:
        "quercia":
            _add_wall(Vector2(205, 135), Vector2(170, 80))
            _add_wall(Vector2(1080, 150), Vector2(150, 75))
            _add_wall(Vector2(1020, 540), Vector2(170, 80))
        "cervia":
            _add_wall(Vector2(185, 150), Vector2(190, 90))
            _add_wall(Vector2(1040, 150), Vector2(170, 90))
            _add_wall(Vector2(640, 110), Vector2(110, 110))
        "leondoro":
            _add_wall(Vector2(175, 145), Vector2(180, 90))
            _add_wall(Vector2(1050, 145), Vector2(170, 90))
            _add_wall(Vector2(640, 360), Vector2(300, 18))
        "lucertola":
            _add_wall(Vector2(180, 150), Vector2(170, 90))
            _add_wall(Vector2(1050, 540), Vector2(180, 90))
        "madonnina":
            _add_wall(Vector2(180, 145), Vector2(170, 90))
            _add_wall(Vector2(1040, 145), Vector2(170, 90))
            _add_wall(Vector2(1040, 540), Vector2(170, 90))
        "ponte":
            _add_wall(Vector2(180, 145), Vector2(170, 90))
            _add_wall(Vector2(1050, 540), Vector2(170, 90))
        "pozzo":
            _add_wall(Vector2(180, 145), Vector2(170, 90))
            _add_wall(Vector2(1050, 145), Vector2(170, 90))
        "ranocchio":
            _add_wall(Vector2(180, 145), Vector2(170, 90))
            _add_wall(Vector2(1050, 540), Vector2(170, 90))

func _build_exits() -> void:
    var neighbors: Dictionary = current_data["neighbors"]
    for direction in neighbors:
        var target: String = neighbors[direction]
        var area := Area2D.new()
        area.collision_layer = 4
        area.collision_mask = 1
        area.set_meta("target", target)
        area.set_meta("direction", direction)
        var shape_node := CollisionShape2D.new()
        var shape := RectangleShape2D.new()
        shape.size = Vector2(EXIT_SIZE, 150) if direction in ["left", "right"] else Vector2(150, EXIT_SIZE)
        shape_node.shape = shape
        match direction:
            "up": area.position = Vector2(640, 18)
            "down": area.position = Vector2(640, 702)
            "left": area.position = Vector2(18, 360)
            "right": area.position = Vector2(1262, 360)
        area.add_child(shape_node)
        area.body_entered.connect(_on_exit_body_entered.bind(area))
        exit_nodes.add_child(area)

func _on_exit_body_entered(body: Node2D, area: Area2D) -> void:
    if body != player:
        return
    var target := str(area.get_meta("target"))
    var direction := str(area.get_meta("direction"))
    if target.is_empty():
        return
    var entry := {"up":"down","down":"up","left":"right","right":"left"}.get(direction, "")
    load_map(target, entry)

func _build_map_interaction() -> void:
    var area := Area2D.new()
    area.collision_layer = 2
    area.collision_mask = 0
    var positions := {
        "cervia":Vector2(640,125),"leondoro":Vector2(900,220),"lucertola":Vector2(850,380),
        "madonnina":Vector2(900,390),"ponte":Vector2(640,376),"pozzo":Vector2(690,300),
        "quercia":Vector2(835,300),"ranocchio":Vector2(1020,190)
    }
    area.position = positions.get(current_map_id, Vector2(640,360))
    area.set_script(load("res://scripts/world/Challenge.gd"))
    area.contrada_id = current_map_id
    area.display_name = "Prova - " + str(current_data["name"])
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 72.0
    shape_node.shape = shape
    area.add_child(shape_node)
    map_nodes.add_child(area)

func _build_map_hotspots() -> void:
    var specs := {
        "quercia":[["Radice antica",Vector2(280,250),"Una radice enorme attraversa il terreno e punta verso il cuore del bosco."]],
        "cervia":[["Sentiero dei cervi",Vector2(280,430),"Tracce fresche nel terreno portano verso Beltrame."]],
        "leondoro":[["Arena del Marzocchino",Vector2(930,220),"Il bersaglio porta un segno recente. Qualcuno si sta allenando."]],
        "lucertola":[["Muro della Ripa",Vector2(285,500),"Piccole scintille corrono tra le pietre e indicano un passaggio."]],
        "madonnina":[["Edicola dei Pagliai",Vector2(930,500),"Un simbolo della Contrada è nascosto tra i fiori."]],
        "ponte":[["Passerella",Vector2(950,240),"Le assi scricchiolano: il ritmo del ponte sembra cambiare."]],
        "pozzo":[["Pozzo antico",Vector2(260,250),"Dal fondo arriva un'eco. Le pietre sembrano raccontare una storia."]],
        "ranocchio":[["Stagno dei Ranocchi",Vector2(260,470),"L'acqua si muove e lascia piccole impronte sul fango."]]
    }
    if not specs.has(current_map_id):
        return
    var spec: Array = specs[current_map_id][0]
    var hotspot := Area2D.new()
    hotspot.position = spec[1]
    hotspot.collision_layer = 2
    hotspot.collision_mask = 0
    hotspot.set_script(load("res://scripts/world/Interactable.gd"))
    hotspot.title = str(spec[0])
    hotspot.text = str(spec[2])
    hotspot.secret_id = current_map_id + "_secret"
    hotspot.required_exploration_steps = 3
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 52.0
    shape_node.shape = shape
    hotspot.add_child(shape_node)
    hotspot_nodes.add_child(hotspot)

func _build_map_objectives() -> void:
    var specs := {
        "quercia":[
            ["Pietra incisa",Vector2(220,210),"Tre segni sul tronco formano una freccia. La pista comincia qui."],
            ["Nastro dorato",Vector2(540,220),"Il nastro indica una deviazione nel bosco. La storia continua."],
            ["Quercia Antica",Vector2(820,500),"Le tre tracce convergono qui. Hai trovato il luogo della prova."]
        ],
        "cervia":[
            ["Prima impronta",Vector2(230,430),"Un'impronta fresca attraversa il sentiero."],
            ["Ramo spezzato",Vector2(560,260),"Il ramo è stato spezzato da poco. Le tracce puntano a Beltrame."],
            ["Radura di Beltrame",Vector2(900,470),"La pista arriva alla radura sotto la torre."]
        ],
        "leondoro":[
            ["Bersaglio ammaccato",Vector2(260,210),"Un segno sul bersaglio indica la prima parte della pista."],
            ["Moneta d'oro",Vector2(620,230),"La moneta riflette la luce verso la zona della tana."],
            ["Ingresso della Tana",Vector2(900,500),"La pista termina qui. Sei pronto per la prova."]
        ],
        "lucertola":[
            ["Pietra calda",Vector2(230,500),"Una pietra con una lucertola incisa indica il percorso."],
            ["Fessura luminosa",Vector2(570,430),"La luce passa tra due rocce e indica il bivio."],
            ["Brace della Ripa",Vector2(900,280),"La brace conferma la strada corretta."]
        ],
        "madonnina":[
            ["Candela",Vector2(230,230),"Una candela si accende per un istante. Prima traccia."],
            ["Fiore bianco",Vector2(560,500),"Il fiore indica il secondo simbolo."],
            ["Simbolo del Pagliaio",Vector2(900,250),"Il simbolo finale completa la sequenza."]
        ],
        "ponte":[
            ["Prima asse",Vector2(220,250),"L'asse regge: è il primo punto sicuro."],
            ["Nodo della corda",Vector2(560,470),"Il nodo rivela il ritmo del passaggio."],
            ["Campana del ponte",Vector2(900,240),"La campana suona: hai capito il percorso."]
        ],
        "pozzo":[
            ["Secchio vuoto",Vector2(210,220),"Il secchio oscilla da solo. Prima traccia."],
            ["Pietra bagnata",Vector2(560,300),"Una pietra bagnata nasconde la seconda parte."],
            ["Pietra del fondo",Vector2(850,500),"La sequenza del mistero è completa."]
        ],
        "ranocchio":[
            ["Cerchio sull'acqua",Vector2(220,480),"Un'onda forma un cerchio perfetto."],
            ["Impronta nel fango",Vector2(520,520),"Una traccia palmata indica la prossima ninfea."],
            ["Canna sonora",Vector2(820,300),"La canna vibra: il sentiero porta al Loto d'Oro."]
        ]
    }
    if not specs.has(current_map_id):
        return
    var objective_script = load("res://scripts/world/ExplorationObjective.gd")
    var index := 1
    for spec in specs[current_map_id]:
        var objective := Area2D.new()
        objective.position = spec[1]
        objective.set_script(objective_script)
        objective.map_id = current_map_id
        objective.objective_step = index
        objective.objective_title = str(spec[0])
        objective.objective_text = str(spec[2])
        var shape_node := CollisionShape2D.new()
        var shape := CircleShape2D.new()
        shape.radius = 42.0
        shape_node.shape = shape
        objective.add_child(shape_node)
        hotspot_nodes.add_child(objective)
        index += 1

func _build_dynamic_event() -> void:
    var specs := {
        "quercia":["Fruscio delle radici",Vector2(760,250),"Le foglie si muovono senza vento e una radice sembra indicare una direzione."],
        "cervia":["Passaggio nella boscaglia",Vector2(400,430),"Qualcosa attraversa il sentiero. Restano nuove tracce."],
        "leondoro":["Rimbalzo d'oro",Vector2(930,300),"Il bersaglio si muove da solo. Qualcuno ha appena colpito."],
        "lucertola":["Scintilla improvvisa",Vector2(350,500),"Una scintilla corre lungo il muro e si spegne vicino a una pietra."],
        "madonnina":["Luce sul simbolo",Vector2(930,440),"Una luce attraversa l'edicola e illumina un simbolo."],
        "ponte":["Asse in movimento",Vector2(900,260),"Una tavola oscilla anche se nessuno la tocca."],
        "pozzo":["Eco dal pozzo",Vector2(300,250),"Dal pozzo arriva un'eco che sembra rispondere."],
        "ranocchio":["Salto nello stagno",Vector2(330,470),"Un ranocchio salta e lascia un'impronta luminosa."]
    }
    if not specs.has(current_map_id):
        return
    var info: Array = specs[current_map_id]
    var event := Area2D.new()
    event.position = info[1]
    event.set_script(load("res://scripts/world/DynamicEvent.gd"))
    event.event_id = current_map_id + "_event"
    event.event_title = str(info[0])
    event.event_text = str(info[2])
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 48.0
    shape_node.shape = shape
    event.add_child(shape_node)
    hotspot_nodes.add_child(event)

func _build_beniamino() -> void:
    var beniamino := Area2D.new()
    beniamino.collision_layer = 2
    beniamino.collision_mask = 0
    var positions := {
        "cervia":Vector2(1080,110),"leondoro":Vector2(1110,470),"lucertola":Vector2(1080,580),
        "madonnina":Vector2(1110,330),"ponte":Vector2(1080,600),"pozzo":Vector2(1050,360),
        "quercia":Vector2(1080,360),"ranocchio":Vector2(1080,170)
    }
    beniamino.position = positions.get(current_map_id, Vector2(1080,360))
    beniamino.set_script(load("res://scripts/world/Beniamino.gd"))
    beniamino.contrada_id = current_map_id
    beniamino.display_name = "Beniamino " + str(current_data["name"])
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 65.0
    shape_node.shape = shape
    beniamino.add_child(shape_node)
    map_nodes.add_child(beniamino)

func _draw() -> void:
    if current_data.is_empty():
        return
    _draw_terrain()
    _draw_navigation()
    draw_string(ThemeDB.fallback_font, Vector2(28, 38), str(current_data["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 28, Color("#fff5d8"))
    draw_string(ThemeDB.fallback_font, Vector2(28, 64), "Esplora  •  parla  •  segui gli indizi", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color("#fff0c4"))

func _draw_terrain() -> void:
    if has_background:
        return
    draw_rect(Rect2(Vector2.ZERO, WORLD_SIZE), Color("#78a45b"))
    # subtle pixel-like grass texture
    for y in range(90, 700, 34):
        for x in range(20, 1280, 42):
            var n := abs((x * 17 + y * 31) % 19)
            if n < 4:
                draw_rect(Rect2(x, y, 3, 3), Color("#6b964f"))
    match current_map_id:
        "quercia": _draw_quercia_terrain()
        "cervia": _draw_cervia_terrain()
        "leondoro": _draw_leon_terrain()
        "lucertola": _draw_lucertola_terrain()
        "madonnina": _draw_madonnina_terrain()
        "ponte": _draw_ponte_terrain()
        "pozzo": _draw_pozzo_terrain()
        "ranocchio": _draw_ranocchio_terrain()

func _draw_path(points: PackedVector2Array, width := 54.0) -> void:
    for i in range(points.size() - 1):
        draw_line(points[i], points[i + 1], Color("#c8aa78"), width)
        draw_line(points[i], points[i + 1], Color("#d8bd8a"), width - 12.0)

func _draw_house(pos: Vector2, size: Vector2, roof: Color, wall := Color("#d9c59a")) -> void:
    draw_rect(Rect2(pos, size), Color("#514737"))
    draw_rect(Rect2(pos + Vector2(4,4), size - Vector2(8,8)), wall)
    var roof_pts := PackedVector2Array([
        pos + Vector2(-8, 8), pos + Vector2(size.x * 0.5, -26),
        pos + Vector2(size.x + 8, 8)
    ])
    draw_colored_polygon(roof_pts, roof)
    draw_rect(Rect2(pos + Vector2(size.x*0.42, size.y*0.48), Vector2(size.x*0.16, size.y*0.52)), Color("#6a4c35"))
    draw_rect(Rect2(pos + Vector2(14, size.y*0.42), Vector2(16, 15)), Color("#8fc1c9"))

func _draw_tree(pos: Vector2, scale := 1.0, foliage := Color("#356b3b")) -> void:
    draw_rect(Rect2(pos + Vector2(-6, 8)*scale, Vector2(12, 34)*scale), Color("#67462d"))
    draw_circle(pos + Vector2(-12,-4)*scale, 18*scale, foliage.darkened(0.15))
    draw_circle(pos + Vector2(9,-8)*scale, 22*scale, foliage)
    draw_circle(pos + Vector2(0,-22)*scale, 18*scale, foliage.lightened(0.08))

func _draw_water(rect: Rect2) -> void:
    draw_rect(rect, Color("#4d91a2"))
    for y in range(int(rect.position.y + 16), int(rect.end.y - 8), 24):
        draw_line(Vector2(rect.position.x+12,y), Vector2(rect.end.x-12,y), Color("#8ac2c5"), 3)

func _draw_landmark(pos: Vector2, label: String, accent: Color) -> void:
    draw_circle(pos, 56, Color(accent, 0.10))
    draw_circle(pos, 42, Color("#5c4b38"))
    draw_circle(pos, 34, accent.darkened(0.20))
    draw_string(ThemeDB.fallback_font, pos + Vector2(-55,70), label, HORIZONTAL_ALIGNMENT_CENTER, 110, 12, Color("#fff0c4"))

func _draw_quercia_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,600),Vector2(250,510),Vector2(420,540),Vector2(570,430),Vector2(760,470),Vector2(930,390),Vector2(1130,420)]))
    _draw_path(PackedVector2Array([Vector2(420,540),Vector2(430,360),Vector2(520,220),Vector2(650,130)]), 44)
    _draw_house(Vector2(120,105),Vector2(170,85),Color("#485c38"))
    _draw_house(Vector2(1010,105),Vector2(150,80),Color("#6b5135"))
    for p in [Vector2(100,280),Vector2(180,370),Vector2(300,120),Vector2(360,300),Vector2(700,180),Vector2(980,300),Vector2(1150,230),Vector2(1160,600)]:
        _draw_tree(p, 0.9)
    _draw_landmark(Vector2(850,500),"QUERCIA ANTICA",Color("#d4af37"))

func _draw_cervia_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,610),Vector2(260,520),Vector2(390,450),Vector2(510,330),Vector2(640,180),Vector2(640,110)]))
    _draw_path(PackedVector2Array([Vector2(390,450),Vector2(700,470),Vector2(940,430),Vector2(1120,500)]),42)
    _draw_house(Vector2(90,105),Vector2(190,85),Color("#6c8f9a"))
    _draw_house(Vector2(970,105),Vector2(150,80),Color("#7598a0"))
    for p in [Vector2(110,310),Vector2(230,220),Vector2(350,580),Vector2(470,170),Vector2(780,300),Vector2(900,560),Vector2(1160,300)]:
        _draw_tree(p, 0.85, Color("#4c7d48"))
    _draw_landmark(Vector2(640,115),"TORRE DI BELTRAME",Color("#8bb7c2"))

func _draw_leon_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,600),Vector2(260,520),Vector2(430,450),Vector2(620,360),Vector2(860,360),Vector2(1090,450)]))
    _draw_path(PackedVector2Array([Vector2(620,360),Vector2(620,170)]),46)
    _draw_house(Vector2(100,105),Vector2(180,85),Color("#b28d2f"))
    _draw_house(Vector2(1000,105),Vector2(180,85),Color("#9b3f38"))
    draw_circle(Vector2(880,240),92,Color("#9b7b35"))
    draw_circle(Vector2(880,240),76,Color("#c5a847"))
    draw_circle(Vector2(880,240),60,Color("#8c6336"))
    for p in [Vector2(250,250),Vector2(360,130),Vector2(430,600),Vector2(1060,600),Vector2(1180,250)]:
        _draw_tree(p,0.82,Color("#4c743f"))
    _draw_landmark(Vector2(880,240),"TANA DEL LEONE",Color("#e1c24a"))

func _draw_lucertola_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,590),Vector2(230,500),Vector2(380,510),Vector2(520,420),Vector2(650,440),Vector2(820,330),Vector2(1100,350)]))
    _draw_house(Vector2(100,105),Vector2(170,85),Color("#9b433e"))
    _draw_house(Vector2(1030,520),Vector2(160,80),Color("#4f7d48"))
    for p in [110,220,330,440,550,660,770,880,990,1100]:
        var y := 180.0 + float((p * 7) % 260)
        draw_circle(Vector2(p,y),24,Color("#8b6d49"))
        draw_circle(Vector2(p+12,y-16),9,Color("#b7a16d"))
    _draw_landmark(Vector2(820,330),"VIA DELLA RIPA",Color("#c95748"))

func _draw_madonnina_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,600),Vector2(260,520),Vector2(450,560),Vector2(610,440),Vector2(760,470),Vector2(930,390),Vector2(1130,420)]))
    _draw_path(PackedVector2Array([Vector2(450,560),Vector2(450,250),Vector2(700,180),Vector2(930,390)]),40)
    _draw_house(Vector2(100,105),Vector2(170,85),Color("#416ea8"))
    _draw_house(Vector2(1010,105),Vector2(170,85),Color("#d2ae3a"))
    _draw_house(Vector2(1010,530),Vector2(160,80),Color("#416ea8"))
    for p in [170,290,410,530,650,770,890,1010,1130]:
        draw_circle(Vector2(p,650 - float((p*3)%70)),8,Color("#e9d6e5"))
    _draw_landmark(Vector2(900,390),"PAGLIAIO PERDUTO",Color("#d7b23b"))

func _draw_ponte_terrain() -> void:
    _draw_water(Rect2(0,310,1280,210))
    _draw_path(PackedVector2Array([Vector2(90,160),Vector2(300,250),Vector2(520,270),Vector2(760,250),Vector2(980,300),Vector2(1190,190)]),52)
    for x in range(150,1160,130):
        draw_rect(Rect2(x,390,82,26),Color("#8b603e"))
        draw_line(Vector2(x,390),Vector2(x+82,416),Color("#c39a62"),4)
    _draw_house(Vector2(100,105),Vector2(170,85),Color("#b24c45"))
    _draw_house(Vector2(1010,540),Vector2(160,80),Color("#416ea8"))
    _draw_landmark(Vector2(640,400),"PONTE DI TAVOLE",Color("#416ea8"))

func _draw_pozzo_terrain() -> void:
    _draw_path(PackedVector2Array([Vector2(90,600),Vector2(240,500),Vector2(400,470),Vector2(560,360),Vector2(740,400),Vector2(900,310),Vector2(1120,390)]))
    _draw_house(Vector2(100,105),Vector2(180,85),Color("#c8c1b2"))
    _draw_house(Vector2(1010,105),Vector2(180,85),Color("#b64b45"))
    for p in [Vector2(140,300),Vector2(330,180),Vector2(480,610),Vector2(760,180),Vector2(990,580),Vector2(1160,260)]:
        draw_circle(p,28,Color("#77736b"))
        draw_circle(p-Vector2(0,5),20,Color("#454b55"))
    _draw_landmark(Vector2(740,400),"MISTERO DEL MICCIO",Color("#7a8fb2"))

func _draw_ranocchio_terrain() -> void:
    _draw_water(Rect2(120,390,330,220))
    _draw_water(Rect2(820,100,300,210))
    _draw_path(PackedVector2Array([Vector2(80,620),Vector2(300,540),Vector2(520,560),Vector2(700,430),Vector2(860,330),Vector2(1040,330),Vector2(1190,450)]),50)
    _draw_house(Vector2(100,105),Vector2(170,85),Color("#d2b13a"))
    _draw_house(Vector2(1010,520),Vector2(170,80),Color("#4f8c4e"))
    for p in [Vector2(520,180),Vector2(680,220),Vector2(750,560),Vector2(1160,580)]:
        _draw_tree(p,0.8,Color("#4f8c4e"))
    for p in [Vector2(200,450),Vector2(300,500),Vector2(900,170),Vector2(1030,230)]:
        draw_circle(p,18,Color("#6fb4a8"))
        draw_circle(p+Vector2(18,-3),12,Color("#6fb4a8"))
    _draw_landmark(Vector2(900,180),"LOTO D'ORO",Color("#d4af37"))

func _draw_map_landmarks() -> void:
    # Small wayfinding markers reinforce the places described by the quest.
    var accent: Color = current_data["accent"]
    var landmark_positions := {
        "quercia":Vector2(850,500),"cervia":Vector2(640,115),"leondoro":Vector2(880,240),
        "lucertola":Vector2(820,330),"madonnina":Vector2(900,390),"ponte":Vector2(640,400),
        "pozzo":Vector2(740,400),"ranocchio":Vector2(900,180)
    }
    var p: Vector2 = landmark_positions.get(current_map_id,Vector2(640,360))
    draw_circle(p,8,accent)
    draw_arc(p,18,0,TAU,24,Color(accent,0.65),2)

func _draw_navigation() -> void:
    # The world remains visually clean; transitions are discovered by exploration.
    return

func get_secret_count() -> int:
    return 8

func get_map_progress() -> Dictionary:
    return {
        "map_id": current_map_id,
        "objectives": GameManager.exploration_progress(current_map_id),
        "objective_total": 3,
        "secrets": GameManager.discovered_secrets.size(),
        "secret_total": get_secret_count(),
        "trial_done": GameManager.trial_completed(current_map_id),
        "beniamino_done": GameManager.has_beniamino(current_map_id)
    }

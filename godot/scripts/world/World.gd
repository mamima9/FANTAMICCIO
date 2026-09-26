extends Node2D

signal map_changed(map_id: String)
signal nearby_interactable_changed(interactable: Area2D)

const WORLD_SIZE := Vector2(1280, 720)
const EXIT_SIZE := 80.0
const ASSET_BASE_URL := "https://raw.githubusercontent.com/mamima9/FANTAMICCIO/main/public/contrade/"

var current_map_id := "quercia"
var current_data: Dictionary = {}
var map_nodes := Node2D.new()
var collision_nodes := Node2D.new()
var exit_nodes := Node2D.new()
var background_request: HTTPRequest
var asset_generation := 0
var hotspot_nodes := Node2D.new()

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
    GameManager.set_map(map_id)
    asset_generation += 1

    _clear_world()
    _build_background()
    _build_boundaries()
    _build_exits()
    _build_map_interaction()
    _build_npc()
    _build_beniamino()
    _build_map_hotspots()
    _build_map_objectives()
    _build_dynamic_event()

    player.global_position = _spawn_for_entry(entry_direction)
    map_changed.emit(map_id)
    WebBridge.progress("map_changed", map_id)
    queue_redraw()

func _clear_world() -> void:
    if is_instance_valid(background_request):
        background_request.queue_free()
        background_request = null
    for child in map_nodes.get_children():
        child.queue_free()
    for child in collision_nodes.get_children():
        child.queue_free()
    for child in exit_nodes.get_children():
        child.queue_free()
    for child in hotspot_nodes.get_children():
        child.queue_free()

func _build_background() -> void:
    # The real FantaMiccio Contrada background is loaded from the repository.
    # This keeps the web build small while using the same assets as the main site.
    var request := HTTPRequest.new()
    request.timeout = 12.0
    background_request = request
    map_nodes.add_child(request)
    var generation := asset_generation
    request.request_completed.connect(_on_background_loaded.bind(generation, request))
    var url := ASSET_BASE_URL + current_map_id + "-bg.png"
    var err := request.request(url)
    if err != OK:
        request.queue_free()
        background_request = null

func _on_background_loaded(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, generation: int, request: HTTPRequest) -> void:
    if generation != asset_generation or request != background_request:
        return
    if result != HTTPRequest.RESULT_SUCCESS or response_code < 200 or response_code >= 300:
        return

    var image := Image.new()
    if image.load_png_from_buffer(body) != OK:
        return

    var texture := ImageTexture.create_from_image(image)
    var sprite := Sprite2D.new()
    sprite.texture = texture
    sprite.centered = false
    sprite.position = Vector2.ZERO
    if image.get_width() > 0 and image.get_height() > 0:
        sprite.scale = Vector2(WORLD_SIZE.x / image.get_width(), WORLD_SIZE.y / image.get_height())
    sprite.z_index = -100
    map_nodes.add_child(sprite)
    request.queue_free()
    background_request = null
    queue_redraw()

func _spawn_for_entry(entry_direction: String) -> Vector2:
    match entry_direction:
        "up":
            return Vector2(640, 100)
        "down":
            return Vector2(640, 620)
        "left":
            return Vector2(110, 360)
        "right":
            return Vector2(1170, 360)
        _:
            return current_data["spawn"]

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
    # Keep the four central openings clear for map transitions.
    _add_wall(Vector2(160, -15), Vector2(320, 30))
    _add_wall(Vector2(1120, -15), Vector2(320, 30))
    _add_wall(Vector2(160, 735), Vector2(320, 30))
    _add_wall(Vector2(1120, 735), Vector2(320, 30))
    _add_wall(Vector2(-15, 90), Vector2(30, 180))
    _add_wall(Vector2(-15, 630), Vector2(30, 180))
    _add_wall(Vector2(1295, 90), Vector2(30, 180))
    _add_wall(Vector2(1295, 630), Vector2(30, 180))

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
            "up":
                area.position = Vector2(640, 18)
            "down":
                area.position = Vector2(640, 702)
            "left":
                area.position = Vector2(18, 360)
            "right":
                area.position = Vector2(1262, 360)

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
    var entry := {"up": "down", "down": "up", "left": "right", "right": "left"}.get(direction, "")
    load_map(target, entry)

func _build_npc() -> void:
    var npc := Area2D.new()
    npc.collision_layer = 2
    npc.collision_mask = 0
    npc.position = Vector2(420, 360)
    npc.set_script(load("res://scripts/world/NPC.gd"))
    var npc_dialogues := {
        "quercia": ["Custode della Quercia", "Le radici ricordano tutto. Cerca dove il terreno sembra nascondere qualcosa."],
        "ranocchio": ["Guardiano dello Stagno", "Se senti un CRA, non scappare. In questa Contrada anche i rumori possono essere indizi."],
        "leondoro": ["Maestro dell'Arena", "Il bersaglio non è l'unica cosa da osservare. Guarda bene gli angoli dell'arena."],
        "lucertola": ["Sentinella del Fuoco", "Le scintille segnano un percorso. Seguilo con calma e non avere paura di saltare."],
        "pozzo": ["Custode del Pozzo", "La luce in fondo non è casuale. C'è qualcosa che risponde quando la guardi."],
        "madonnina": ["Custode della Madonnina", "Qui i piccoli dettagli contano più della forza. Cerca il simbolo nascosto."],
        "cervia": ["Esploratore della Cervia", "Le tracce non sono vecchie. Segui il sentiero e guarda dove il terreno cambia."],
        "ponte": ["Passatore del Ponte", "Il passaggio sicuro non è sempre quello più veloce. Osserva prima di attraversare."]
    }
    var info: Array = npc_dialogues.get(current_map_id, ["Custode della Contrada", "Ogni territorio custodisce una prova. Esplora e interagisci con ciò che trovi."])
    npc.npc_name = str(info[0])
    npc.title = npc.npc_name
    npc.dialogue = str(info[1])
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 55.0
    shape_node.shape = shape
    npc.add_child(shape_node)
    map_nodes.add_child(npc)

func _build_map_interaction() -> void:
    var area := Area2D.new()
    area.collision_layer = 2
    area.collision_mask = 0
    area.position = Vector2(640, 360)
    area.set_script(load("res://scripts/world/Challenge.gd"))
    area.contrada_id = current_map_id
    area.display_name = "Prova " + str(current_data["name"])
    var shape_node := CollisionShape2D.new()
    var shape := CircleShape2D.new()
    shape.radius = 75.0
    shape_node.shape = shape
    area.add_child(shape_node)
    map_nodes.add_child(area)

func _build_map_hotspots() -> void:
    # Each Contrada gets small exploration points so the world is more than
    # a walk from the entrance to the trial and Beniamino.
    var specs: Array = []
    match current_map_id:
        "quercia":
            specs = [["Radice antica", Vector2(280, 250), "Una radice enorme attraversa il terreno. Sembra indicare il cuore della Quercia.", "radice"]]
        "ranocchio":
            specs = [["Stagno dei Ranocchi", Vector2(260, 470), "L'acqua si muove... qualcosa sta per saltare fuori.", "stagno"]]
        "leondoro":
            specs = [["Arena d'oro", Vector2(930, 220), "Qui si allenano i campioni. Il bersaglio della prova sembra ancora caldo.", "arena"]]
        "lucertola":
            specs = [["Muro del fuoco", Vector2(285, 500), "Piccole scintille corrono tra le pietre. La Lucertola sembra conoscere il passaggio.", "fuoco"]]
        "pozzo":
            specs = [["Pozzo antico", Vector2(260, 250), "Dal fondo arriva una luce intermittente. Non sembra una luce normale.", "pozzo"]]
        "madonnina":
            specs = [["Edicola della Madonnina", Vector2(930, 500), "Un piccolo luogo di raccoglimento custodisce un simbolo della Contrada.", "edicola"]]
        "cervia":
            specs = [["Sentiero dei cervi", Vector2(280, 430), "Tracce fresche nel terreno. Qualcuno è passato da poco.", "tracce"]]
        "ponte":
            specs = [["Passerella del Ponte", Vector2(950, 240), "Le assi scricchiolano sotto i piedi. Meglio attraversare con attenzione.", "passerella"]]

    for spec in specs:
        var hotspot := Area2D.new()
        hotspot.position = spec[1]
        hotspot.collision_layer = 2
        hotspot.collision_mask = 0
        hotspot.set_meta("hotspot_id", current_map_id + "_" + str(spec[3]))
        hotspot.set_meta("hotspot_title", str(spec[0]))
        hotspot.set_meta("hotspot_text", str(spec[2]))
        hotspot.set_script(load("res://scripts/world/Interactable.gd"))
        hotspot.title = str(spec[0])
        hotspot.text = str(spec[2])
        hotspot.secret_id = current_map_id + "_secret"
        var shape_node := CollisionShape2D.new()
        var shape := CircleShape2D.new()
        shape.radius = 52.0
        shape_node.shape = shape
        hotspot.add_child(shape_node)
        hotspot_nodes.add_child(hotspot)

        # A subtle visual marker, deliberately small so it doesn't cover the real map art.
        var marker := Polygon2D.new()
        marker.polygon = PackedVector2Array([
            Vector2(-13, 13), Vector2(0, -16), Vector2(13, 13)
        ])
        marker.color = Color(current_data["accent"], 0.75)
        marker.position = Vector2(0, -45)
        hotspot.add_child(marker)


func _build_map_objectives() -> void:
    var specs := {
        "quercia": [
            ["Radice incisa", Vector2(220, 210), "Tre segni sul tronco formano una freccia. Hai trovato la prima traccia."],
            ["Foglia dorata", Vector2(540, 220), "Una foglia dorata è incastrata tra le radici. La traccia continua."],
            ["Cuore della quercia", Vector2(820, 500), "Il terreno vibra leggermente. Hai seguito tutta la pista delle radici."]
        ],
        "ranocchio": [
            ["Cerchio sull'acqua", Vector2(220, 480), "Un'onda forma un cerchio perfetto. È il primo segnale dello stagno."],
            ["Impronta sul fango", Vector2(520, 520), "Una piccola impronta palmata indica il prossimo punto."],
            ["Canna sonora", Vector2(820, 300), "La canna vibra con un CRA. Hai completato il percorso dei Ranocchi."]
        ],
        "leondoro": [
            ["Bersaglio ammaccato", Vector2(260, 210), "Il primo bersaglio porta un segno fresco. Qualcuno si sta allenando."],
            ["Moneta nell'arena", Vector2(620, 230), "Una moneta dorata riflette la luce e indica la zona successiva."],
            ["Podio d'oro", Vector2(900, 500), "Il podio è illuminato. La pista dell'arena è completa."]
        ],
        "lucertola": [
            ["Pietra calda", Vector2(230, 500), "La pietra emette una scintilla: è l'inizio del percorso."],
            ["Fessura luminosa", Vector2(570, 430), "La luce passa tra due rocce. Il sentiero del fuoco continua."],
            ["Brace finale", Vector2(900, 280), "Una brace si accende davanti a te. Hai seguito tutte le scintille."]
        ],
        "pozzo": [
            ["Secchio vuoto", Vector2(210, 220), "Il secchio oscilla da solo. Primo indizio del pozzo."],
            ["Eco blu", Vector2(560, 300), "Un'eco luminosa risponde dal sottosuolo."],
            ["Pietra del fondo", Vector2(850, 500), "La pietra riflette la luce del pozzo. La sequenza è completa."]
        ],
        "madonnina": [
            ["Candela spenta", Vector2(230, 230), "Una candela si accende per un istante. Prima traccia trovata."],
            ["Fiore bianco", Vector2(560, 500), "Un fiore è stato lasciato accanto al sentiero."],
            ["Simbolo nascosto", Vector2(900, 250), "Il simbolo finale completa il piccolo percorso della Madonnina."]
        ],
        "cervia": [
            ["Prima impronta", Vector2(230, 430), "Un'impronta fresca attraversa il sentiero."],
            ["Ramo spezzato", Vector2(560, 260), "Il ramo è stato spezzato da poco. Le tracce continuano."],
            ["Radura", Vector2(900, 470), "La pista arriva alla radura. Hai seguito il cervo fino alla fine."]
        ],
        "ponte": [
            ["Prima asse", Vector2(220, 250), "L'asse scricchiola ma regge. Primo punto sicuro."],
            ["Nodo della corda", Vector2(560, 470), "Un nodo nuovo indica il passaggio successivo."],
            ["Campana del ponte", Vector2(900, 240), "La campana suona al tuo arrivo. Attraversamento completato."]
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
        "quercia": ["Fruscio delle radici", Vector2(760, 250), "Le foglie si muovono senza vento. Per un istante una radice sembra indicare una direzione precisa."],
        "ranocchio": ["Salto nello stagno", Vector2(330, 470), "CRA! Un ranocchio salta fuori dall'acqua e lascia una piccola impronta luminosa sulla riva."],
        "leondoro": ["Rimbalzo d'oro", Vector2(930, 300), "Un riflesso attraversa l'arena. Il bersaglio si muove da solo, come se qualcuno lo avesse appena colpito."],
        "lucertola": ["Scintilla improvvisa", Vector2(350, 500), "Una scintilla corre lungo il muro e si spegne vicino a una pietra che sembra fuori posto."],
        "pozzo": ["Eco dal pozzo", Vector2(300, 250), "Dal pozzo arriva un'eco. Non ripete il tuo rumore: sembra quasi rispondere."],
        "madonnina": ["Luce sul simbolo", Vector2(930, 440), "Una luce attraversa l'edicola per un secondo e illumina un piccolo simbolo nascosto."],
        "cervia": ["Passaggio nella boscaglia", Vector2(400, 430), "Qualcosa attraversa rapidamente il sentiero. Restano nuove tracce nel terreno."],
        "ponte": ["Asse in movimento", Vector2(900, 260), "Una delle assi oscilla anche se nessuno la sta toccando. Poi torna perfettamente ferma."]
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
    beniamino.position = Vector2(1080, 360)
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

    # Real map art is supplied by the Contrada background asset.
    # Keep only a readable title/transition hint over it.
    var accent: Color = current_data["accent"]
    draw_string(ThemeDB.fallback_font, Vector2(32, 44), str(current_data["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 28, Color("#fff5d8"))
    draw_string(ThemeDB.fallback_font, Vector2(32, 70), "Esplora • Interagisci • Trova il Beniamino", HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color(1, 0.96, 0.82, 0.92))

    var neighbors: Dictionary = current_data["neighbors"]
    var labels := {
        "up": Vector2(600, 35),
        "down": Vector2(600, 705),
        "left": Vector2(30, 345),
        "right": Vector2(1080, 345)
    }
    for direction in neighbors:
        var target: String = neighbors[direction]
        var data: Dictionary = MapData.get_map(target)
        draw_string(ThemeDB.fallback_font, labels[direction], "→ " + str(data["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(1, 0.95, 0.75, 0.9))


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

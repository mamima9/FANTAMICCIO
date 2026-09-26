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

@onready var player: CharacterBody2D = get_parent().get_node("Player")

func _ready() -> void:
    add_child(map_nodes)
    add_child(collision_nodes)
    add_child(exit_nodes)
    load_map(GameManager.current_map)

func load_map(map_id: String) -> void:
    if not MapData.MAPS.has(map_id):
        map_id = "quercia"

    current_map_id = map_id
    current_data = MapData.get_map(map_id)
    GameManager.set_map(map_id)

    _clear_world()
    _build_boundaries()
    _build_exits()
    _build_landmarks()
    _build_map_interaction()
    _build_beniamino()

    player.global_position = current_data["spawn"]
    map_changed.emit(map_id)
    queue_redraw()

func _clear_world() -> void:
    for child in map_nodes.get_children():
        child.queue_free()
    for child in collision_nodes.get_children():
        child.queue_free()
    for child in exit_nodes.get_children():
        child.queue_free()

func _build_boundaries() -> void:
    _add_wall(Vector2(640, -15), Vector2(1280, 30))
    _add_wall(Vector2(640, 735), Vector2(1280, 30))
    _add_wall(Vector2(-15, 360), Vector2(30, 720))
    _add_wall(Vector2(1295, 360), Vector2(30, 720))

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

func _build_exits() -> void:
    var neighbors: Dictionary = current_data["neighbors"]
    for direction in neighbors:
        var target: String = neighbors[direction]
        var area := Area2D.new()
        area.collision_layer = 4
        area.collision_mask = 1
        area.set_meta("target", target)
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
    if target.is_empty():
        return
    load_map(target)

func _build_landmarks() -> void:
    var accent: Color = current_data["accent"]
    var base: Color = current_data["color"]

    for position in [
        Vector2(150, 150), Vector2(350, 125), Vector2(930, 135),
        Vector2(1110, 235), Vector2(200, 560), Vector2(1040, 560)
    ]:
        _draw_landmark(position, base.darkened(0.18), accent)

    # Central landmark differs per territory.
    var center := Vector2(640, 360)
    draw_set_transform(Vector2.ZERO)
    _draw_centerpiece(center, accent)

func _draw_landmark(position: Vector2, base: Color, accent: Color) -> void:
    var node := Node2D.new()
    node.position = position
    node.set_script(load("res://scripts/world/Landmark.gd"))
    node.set_meta("base", base)
    node.set_meta("accent", accent)
    map_nodes.add_child(node)

func _draw_centerpiece(position: Vector2, accent: Color) -> void:
    var node := Node2D.new()
    node.position = position
    node.set_script(load("res://scripts/world/Centerpiece.gd"))
    node.set_meta("accent", accent)
    node.set_meta("map_id", current_map_id)
    map_nodes.add_child(node)

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

    var base: Color = current_data["color"]
    var accent: Color = current_data["accent"]

    draw_rect(Rect2(Vector2.ZERO, WORLD_SIZE), base)

    # Roads and plazas.
    draw_rect(Rect2(0, 305, WORLD_SIZE.x, 110), base.lightened(0.16))
    draw_rect(Rect2(585, 0, 110, WORLD_SIZE.y), base.lightened(0.16))
    draw_rect(Rect2(420, 225, 440, 270), base.lightened(0.27))

    # Decorative stripes tied to each Contrada.
    for i in range(8):
        var x := 450.0 + i * 50.0
        draw_rect(Rect2(x, 238, 32, 10), accent, true)

    draw_string(ThemeDB.fallback_font, Vector2(32, 44), str(current_data["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 28, Color("#fff5d8"))
    draw_string(ThemeDB.fallback_font, Vector2(32, 70), "Esplora • Interagisci • Trova il Beniamino", HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color(1, 0.96, 0.82, 0.82))

    _draw_direction_labels()

func _draw_direction_labels() -> void:
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
        draw_string(ThemeDB.fallback_font, labels[direction], "→ " + str(data["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(1, 0.95, 0.75, 0.78))

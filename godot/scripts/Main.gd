extends Node2D

const WORLD_SIZE := Vector2(1280, 720)

@onready var player: CharacterBody2D = $Player
@onready var hud: CanvasLayer = $HUD
@onready var world: Node2D = $World

func _ready() -> void:
    SaveManager.load_game()
    GameManager.start_game()

    # WebBridge reads the user's Contrada from the iframe query string.
    # Never overwrite that selection with Quercia: the world must open in
    # the Contrada belonging to the logged-in FantaMiccio player.
    var initial_map := GameManager.selected_contrada
    if initial_map.is_empty() or not MapData.MAPS.has(initial_map):
        initial_map = GameManager.current_map
    if initial_map.is_empty() or not MapData.MAPS.has(initial_map):
        initial_map = "quercia"

    GameManager.set_map(initial_map)
    if world.has_method("load_map"):
        world.load_map(initial_map)

    player.nearby_interactable_changed.connect(_on_nearby_interactable_changed)
    queue_redraw()

func _on_nearby_interactable_changed(interactable: Area2D) -> void:
    if not is_instance_valid(interactable):
        hud.set_prompt("")
        return

    var title := str(interactable.get("title"))
    if title.is_empty() and interactable.has_method("get_title"):
        title = str(interactable.get_title())
    if title.is_empty():
        title = "Interagisci"
    hud.set_prompt("E  •  " + title)

func show_interaction(title: String, text: String) -> void:
    hud.show_interaction(title, text)

func _draw() -> void:
    # Fallback under the real Contrada background.
    draw_rect(Rect2(Vector2.ZERO, WORLD_SIZE), Color("#6f9b55"))

func _process(_delta: float) -> void:
    if world:
        hud.set_map_progress(
            world.current_map_id,
            GameManager.discovered_secrets.size(),
            world.get_secret_count()
        )

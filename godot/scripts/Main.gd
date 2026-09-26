extends Node2D

const WORLD_SIZE := Vector2(1280, 720)

@onready var player: CharacterBody2D = $Player

func _ready() -> void:
    GameManager.start_game()
    GameManager.set_map("quercia")
    player.global_position = Vector2(640, 430)
    queue_redraw()

func _draw() -> void:
    draw_rect(Rect2(Vector2.ZERO, WORLD_SIZE), Color("#6f9b55"))

    # Main roads
    draw_rect(Rect2(0, 305, WORLD_SIZE.x, 110), Color("#b69b6d"))
    draw_rect(Rect2(585, 0, 110, WORLD_SIZE.y), Color("#b69b6d"))

    # Central square
    draw_rect(Rect2(420, 225, 440, 270), Color("#c7b486"))
    draw_rect(Rect2(435, 240, 410, 240), Color("#d2bf94"))

    # Water
    draw_rect(Rect2(45, 75, 255, 175), Color("#5795a5"))
    draw_circle(Vector2(172, 162), 72, Color("#66a5b2"))

    # Forest clusters
    for position in [
        Vector2(115, 520), Vector2(195, 575), Vector2(285, 525),
        Vector2(1015, 115), Vector2(1100, 175), Vector2(1180, 110),
        Vector2(1040, 570), Vector2(1160, 510)
    ]:
        _draw_tree(position)

    # Fountain
    draw_circle(Vector2(640, 360), 56, Color("#77706a"))
    draw_circle(Vector2(640, 360), 39, Color("#5795a5"))
    draw_circle(Vector2(640, 360), 8, Color("#d6c08a"))

    draw_string(
        ThemeDB.fallback_font,
        Vector2(40, 48),
        "FANTAMICCIO",
        HORIZONTAL_ALIGNMENT_LEFT,
        -1,
        30,
        Color("#fff2c7")
    )

    draw_string(
        ThemeDB.fallback_font,
        Vector2(40, 76),
        "CORE DI ESPLORAZIONE",
        HORIZONTAL_ALIGNMENT_LEFT,
        -1,
        16,
        Color(1.0, 0.95, 0.82, 0.78)
    )

func _draw_tree(position: Vector2) -> void:
    draw_circle(position + Vector2(0, 17), 20, Color("#70482d"))
    draw_circle(position + Vector2(0, -14), 42, Color("#345c38"))
    draw_circle(position + Vector2(-25, -3), 28, Color("#3f7041"))
    draw_circle(position + Vector2(25, -3), 28, Color("#3f7041"))

extends Node2D

# Scoperte facoltative: non bloccano la quest principale, ma premiano
# chi esplora davvero il territorio.
var spots := [
    {"pos": Vector2(300,760), "title": "Radura nascosta", "text": "Tra le querce trovi un piccolo nastro della Contrada. Qualcuno è passato di qui prima di te."},
    {"pos": Vector2(1850,930), "title": "Il vecchio sentiero", "text": "Una pietra porta inciso il simbolo della Quercia. Il bosco conserva più storie di quelle che raccontano gli abitanti."},
    {"pos": Vector2(2050,350), "title": "Il segno sulla corteccia", "text": "Un'incisione antica raffigura un Miccio accanto a una quercia. Potrebbe essere un indizio per qualcosa che verrà dopo."}
]
var player_near := -1
var pulse := 0.0
var found := {}

func _ready() -> void:
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    player_near = -1
    var player = get_tree().current_scene.get_node_or_null("Player")
    if player:
        for i in spots.size():
            if player.global_position.distance_to(spots[i].pos) < 68.0:
                player_near = i
                break
    if player_near >= 0 and Input.is_action_just_pressed("interact"):
        _interact()
    queue_redraw()

func _interact() -> void:
    if player_near < 0:
        return
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    var data = spots[player_near]
    found[player_near] = true
    if hud and hud.has_method("show_dialogue"):
        hud.show_dialogue(data.title, data.text)

func _draw() -> void:
    for i in spots.size():
        var p: Vector2 = spots[i].pos
        var discovered := found.has(i)
        var glow := 7.0 + sin(pulse * 3.0 + i) * 2.0
        draw_circle(p, glow + 8.0, Color(0.83,0.68,0.28,0.07 if discovered else 0.12))
        draw_circle(p, 3.5, Color("#d4af37") if not discovered else Color("#78935b"))
        if player_near == i:
            draw_arc(p, 22.0 + sin(pulse * 4.0) * 2.0, 0.0, TAU, 20, Color("#f6d878"), 2.0)

extends Node2D

var pulse := 0.0
var player_near := -1
var clue_positions := [Vector2(805, 545), Vector2(1040, 700), Vector2(1335, 585)]
var gate_position := Vector2(1390, 650)

func _ready() -> void:
    queue_redraw()

func refresh() -> void:
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    var player = get_tree().current_scene.get_node_or_null("Player")
    player_near = -1
    if player:
        for i in clue_positions.size():
            if player.global_position.distance_to(clue_positions[i]) < 72.0:
                player_near = i
                break
    if player and player.global_position.distance_to(gate_position) < 90.0:
        player_near = 3
    if player_near >= 0 and Input.is_action_just_pressed("interact"):
        _interact()
    queue_redraw()

func _interact() -> void:
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    if not quest:
        return
    if player_near < 3:
        var needed := player_near + 1
        if quest.step == needed:
            quest.discover_clue(player_near)
            if hud and hud.has_method("show_dialogue"):
                var texts = [
                    "Una corteccia graffiata: il segno del Miccio indica il sentiero verso il bosco interno.",
                    "Un nastro dorato. Il vecchio aveva ragione: il percorso più corto nasconde una deviazione.",
                    "Tre tacche sul tronco. La prova è vicina: segui la luce verso il Contradaiolo."
                ]
                hud.show_dialogue("INDIZIO DEL BOSCO", texts[player_near])
        elif hud and hud.has_method("show_toast"):
            hud.show_toast("Non hai ancora scoperto questo indizio.")
    elif quest.step < 3 and hud and hud.has_method("show_toast"):
        hud.show_toast("Il sentiero è ancora chiuso. Segui gli indizi degli abitanti.")

func _draw() -> void:
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    if not quest:
        return
    for i in clue_positions.size():
        var unlocked := quest.step >= i + 1
        var found := quest.discoveries >= i + 1
        var p: Vector2 = clue_positions[i]
        if unlocked and not found:
            var glow := 13.0 + sin(pulse * 4.0 + i) * 4.0
            draw_circle(p, glow + 10.0, Color(1,0.78,0.25,0.10))
            draw_circle(p, 7.0, Color("#e7bd4e"))
            draw_line(p + Vector2(-9,0), p + Vector2(9,0), Color("#fff0a8"), 2)
            draw_line(p + Vector2(0,-9), p + Vector2(0,9), Color("#fff0a8"), 2)
        elif found:
            draw_circle(p, 5.0, Color("#6f8d54"))
    if quest.step >= 3:
        var g := gate_position
        draw_arc(g, 38.0 + sin(pulse * 3.0) * 4.0, PI, TAU, 20, Color(1,0.82,0.35,0.55), 4)
        draw_circle(g, 5.0, Color("#fff0a8"))
    if player_near >= 0:
        var p2 := gate_position if player_near == 3 else clue_positions[player_near]
        draw_circle(p2 + Vector2(0,-48), 5.0 + sin(pulse*5.0)*2.0, Color("#f3d26b"))

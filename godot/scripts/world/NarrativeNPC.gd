extends Area2D

@export var contrada_id := ""
@export var stage_required := 0
@export var npc_name := "Abitante"
@export_multiline var dialogue := ""

func _ready() -> void:
    add_to_group("interactable")
    collision_layer = 2
    collision_mask = 0
    monitoring = true
    queue_redraw()

func get_title() -> String:
    return npc_name

func interact() -> void:
    var story := GameManager.narrative_step(contrada_id)
    var progress := GameManager.exploration_progress(contrada_id)
    var main := get_tree().current_scene

    if story < stage_required:
        if main and main.has_method("show_interaction"):
            main.show_interaction(npc_name, "Non hai ancora seguito tutta la traccia precedente. Cerca l'indizio %d/3 e torna qui." % stage_required)
        return

    if stage_required > 0 and progress < stage_required:
        if main and main.has_method("show_interaction"):
            main.show_interaction(npc_name, "Prima trova l'indizio %d/3. La storia continua da lì." % stage_required)
        return

    if story == stage_required:
        GameManager.advance_narrative(contrada_id, stage_required + 1)
        SaveManager.save_game()
        WebBridge.progress("npc_dialogue", contrada_id)

    if main and main.has_method("show_interaction"):
        main.show_interaction(npc_name, dialogue)

func _draw() -> void:
    var accent := MapData.get_map(contrada_id)["accent"] if MapData.MAPS.has(contrada_id) else Color("#d6ad4d")
    draw_circle(Vector2(0, 22), 17, Color(0.03,0.02,0.015,0.35))
    draw_circle(Vector2(0, -10), 15, Color("#d9a56b"))
    draw_rect(Rect2(-14, 3, 28, 29), accent)
    draw_rect(Rect2(-17, -24, 34, 8), Color("#d1ad52"))
    draw_circle(Vector2(-5, -11), 2.2, Color("#241913"))
    draw_circle(Vector2(5, -11), 2.2, Color("#241913"))
    if GameManager.narrative_step(contrada_id) == stage_required:
        draw_circle(Vector2(0, -48), 5 + sin(Time.get_ticks_msec() * 0.005) * 1.5, Color("#f4d77d"))

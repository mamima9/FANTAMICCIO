extends Node2D

var pulse := 0.0
var contrada_id := "quercia"
const REGIONAL_CLUES := {
 "cervia":["Una pietra porta il simbolo del cervo: indica la strada verso Beltrame.","Una campanella spezzata rivela il sentiero più sicuro.","Tre tacche sulla torre: la prova è pronta."],
 "leondoro":["Un'impronta conduce verso la tana del leone.","Un nastro rosso indica dove non entrare.","Il ruggito annuncia la prova."],
 "lucertola":["Una pietra della Ripa porta una lucertola incisa.","Le tracce indicano il bivio meno luminoso.","La terza pietra conferma la via."],
 "madonnina":["Un filo di paglia porta un simbolo blu.","Tra i covoni compare una seconda traccia.","La memoria dei segni ti condurrà al pagliaio."],
 "ponte":["Una tavola incisa indica il primo passaggio.","Il fiume rivela il ritmo delle assi.","L'ultima tavola conduce alla prova."],
 "pozzo":["Una moneta vicino al pozzo indica la prima traccia.","Una pietra bagnata nasconde il secondo indizio.","Il simbolo del Miccio completa il mistero."],
 "quercia":["Una corteccia graffiata indica il sentiero verso il bosco interno.","Un nastro dorato rivela una deviazione.","Tre tacche sul tronco: il Contradaiolo ti aspetta."],
 "ranocchio":["Un segno verde appare vicino allo stagno.","Le impronte delle rane indicano la sequenza delle ninfee.","Il loto riflette il simbolo della prova."]
}
func set_contrada(id:String) -> void:
    contrada_id=id.to_lower()
    var data=REGIONAL_CLUES.get(contrada_id,REGIONAL_CLUES["quercia"])
    for i in data.size():
        clue_texts[i]=data[i]
    var positions = REGIONAL_POSITIONS.get(contrada_id, REGIONAL_POSITIONS["quercia"])
    clue_positions = positions.slice(0,3)
    gate_position = positions[3]
    queue_redraw()

var player_near := -1
const REGIONAL_POSITIONS := {
 "cervia":[Vector2(600,720),Vector2(1050,520),Vector2(1370,360),Vector2(1500,330)],
 "leondoro":[Vector2(700,760),Vector2(1080,580),Vector2(1370,470),Vector2(1510,430)],
 "lucertola":[Vector2(650,600),Vector2(1050,780),Vector2(1320,680),Vector2(1450,700)],
 "madonnina":[Vector2(620,780),Vector2(1040,560),Vector2(1350,450),Vector2(1510,410)],
 "ponte":[Vector2(650,850),Vector2(1040,650),Vector2(1320,570),Vector2(1500,560)],
 "pozzo":[Vector2(600,800),Vector2(1050,640),Vector2(1340,480),Vector2(1510,420)],
 "quercia":[Vector2(805,545),Vector2(1040,700),Vector2(1335,585),Vector2(1390,650)],
 "ranocchio":[Vector2(650,800),Vector2(1050,650),Vector2(1320,500),Vector2(1510,430)]
}
var clue_positions := REGIONAL_POSITIONS["quercia"].slice(0,3)
var gate_position := REGIONAL_POSITIONS["quercia"][3]

var clue_texts := [
    "Una corteccia graffiata: il segno del Miccio indica il sentiero verso il bosco interno.",
    "Un nastro dorato: il percorso più corto nasconde una deviazione. Il bosco vuole che tu osservi.",
    "Tre tacche sul tronco: hai seguito la storia fino in fondo. Il Contradaiolo ti aspetta."
]

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
        if player.global_position.distance_to(gate_position) < 90.0:
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
        var index := player_near
        if quest.discoveries == index and quest.step >= index + 1:
            if quest.discover_clue(index):
                if hud and hud.has_method("show_dialogue"):
                    hud.show_dialogue("INDIZIO DEL BOSCO", clue_texts[index])
        elif quest.discoveries > index:
            if hud and hud.has_method("show_toast"):
                hud.show_toast("Hai già scoperto questo indizio.")
        elif hud and hud.has_method("show_toast"):
            hud.show_toast("Il segno non è ancora pronto per essere letto.")
    else:
        if quest.step < 3:
            if hud and hud.has_method("show_toast"):
                hud.show_toast("Il sentiero è chiuso. Prima segui tutti gli indizi.")
        elif quest.discoveries < 3:
            if hud and hud.has_method("show_toast"):
                hud.show_toast("Manca ancora un segno dorato nel bosco.")
        else:
            if hud and hud.has_method("show_toast"):
                hud.show_toast("Il Contradaiolo ti aspetta per la prova.")

func _draw() -> void:
    var quest = get_tree().current_scene.get_node_or_null("QuestManager")
    if not quest:
        return

    for i in clue_positions.size():
        var unlocked := quest.step >= i + 1 and quest.discoveries == i
        var found := quest.discoveries > i
        var p: Vector2 = clue_positions[i]

        if unlocked:
            var glow := 15.0 + sin(pulse * 4.0 + i) * 5.0
            draw_circle(p, glow + 13.0, Color(1,0.78,0.25,0.10))
            draw_circle(p, 8.0, Color("#e7bd4e"))
            draw_line(p + Vector2(-10,0), p + Vector2(10,0), Color("#fff0a8"), 2)
            draw_line(p + Vector2(0,-10), p + Vector2(0,10), Color("#fff0a8"), 2)
        elif found:
            draw_circle(p, 5.0, Color("#6f8d54"))

    if quest.step >= 3 and quest.discoveries >= 3:
        var g := gate_position
        draw_arc(g, 38.0 + sin(pulse * 3.0) * 4.0, PI, TAU, 20, Color(1,0.82,0.35,0.55), 4)
        draw_circle(g, 5.0, Color("#fff0a8"))

    if player_near >= 0:
        var p2 := gate_position if player_near == 3 else clue_positions[player_near]
        draw_circle(p2 + Vector2(0,-48), 5.0 + sin(pulse*5.0)*2.0, Color("#f3d26b"))

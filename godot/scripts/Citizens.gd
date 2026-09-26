extends Area2D

@export var citizen_name := "Contradaiolo"
@export_multiline var dialogue: Array[String] = []
@export var contrada_color := Color("#4f7f43")
@export var accent_color := Color("#d4af37")
@export var home := Vector2.ZERO
@export var wander_radius := 80.0

var player_near := false
var target := Vector2.ZERO
var wait := 0.0
var phase := 0.0
var dialogue_index := 0
var rng := RandomNumberGenerator.new()

var contrada_id := "quercia"
const THEMES := {
 "cervia":{"primary":Color("#f1eee1"),"accent":Color("#7eb7c7"),"people":["Contradaiolo della Cervia","Ragazza di Beltrame","Anziano della Cervia"]},
 "leondoro":{"primary":Color("#e6c63f"),"accent":Color("#c94f45"),"people":["Contradaiolo del Leon d'Oro","Ragazza del Marzocchino","Leoncino del Borgo"]},
 "lucertola":{"primary":Color("#c84f45"),"accent":Color("#4f8d4b"),"people":["Contradaiolo della Lucertola","Ragazzo della Ripa","Anziana della Lucertola"]},
 "madonnina":{"primary":Color("#416ea8"),"accent":Color("#e2bf3b"),"people":["Contradaiola della Madonnina","Ragazza dei Pagliai","Contadino della Madonnina"]},
 "ponte":{"primary":Color("#c84e48"),"accent":Color("#416ea8"),"people":["Contradaiolo del Ponte","Ragazza del Ponte","Barcaiolo del Ponte"]},
 "pozzo":{"primary":Color("#eee9dc"),"accent":Color("#c84e48"),"people":["Contradaiolo del Pozzo","Ragazza della Piazza","Anziano del Pozzo"]},
 "quercia":{"primary":Color("#3f6f45"),"accent":Color("#d4af37"),"people":["Contradaiolo della Quercia","Ragazza della Quercia","Anziano della Quercia"]},
 "ranocchio":{"primary":Color("#e2c83f"),"accent":Color("#4f8c4e"),"people":["Contradaiolo del Ranocchio","Ragazza dello Stagno","Bambino del Ranocchio"]}
}

func set_contrada(id:String) -> void:
    contrada_id=id.to_lower()
    _spawn_population()

func _spawn_population() -> void:
    var container = get_node_or_null("Cittadini")
    if not container: return
    for child in container.get_children(): child.queue_free()
    var d:Dictionary = THEMES.get(contrada_id,THEMES["quercia"])
    var positions=[Vector2(420,520),Vector2(760,420),Vector2(980,300),Vector2(1340,900),Vector2(1730,720),Vector2(2050,860),Vector2(380,930),Vector2(1880,520),Vector2(1100,950)]
    for i in positions.size():
        var n=Area2D.new()
        n.name="Cittadino_%02d"%i
        n.set_script(get_script())
        n.set("citizen_name",d.people[i%d.people.size()])
        n.set("contrada_color",d.primary)
        n.set("accent_color",d.accent)
        n.set("dialogue",_dialogues(i))
        n.set("wander_radius",55.0+float(i%3)*25.0)
        var cs=CollisionShape2D.new()
        var sh=CircleShape2D.new()
        sh.radius=34.0
        cs.shape=sh
        n.add_child(cs)
        var p=Label.new()
        p.name="Prompt"
        p.text="E  •  PARLA"
        p.position=Vector2(-55,-55)
        p.size=Vector2(110,24)
        p.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
        p.add_theme_color_override("font_color",Color("#fff0b0"))
        p.add_theme_font_size_override("font_size",11)
        n.add_child(p)
        container.add_child(n)
        n.position=positions[i]

func _dialogues(i:int) -> Array[String]:
    var common=[
      ["Qui ogni contradaiolo ha una storia da raccontare.","Guarda bene anche dietro le strade principali."],
      ["La nostra Contrada cambia volto quando arriva il Palio.","Se esplori, trovi sempre qualcosa."],
      ["Conosci il luogo della prova? Io seguirei i segni.","Gli anziani sanno cose che la mappa non mostra."],
      ["Non avere fretta. Il territorio va guardato.","Hai già parlato con gli altri abitanti?"],
      ["Questo posto è pieno di piccoli segreti.","Forse il prossimo indizio è proprio vicino a noi."],
      ["Da bambino correvo qui ogni giorno.","Alcuni sentieri sembrano inutili, ma non lo sono."],
      ["Hai visto il Miccio? Potrebbe essere nascosto dove meno te lo aspetti.","Continua a esplorare."],
      ["La Contrada non è solo la prova.","È anche la gente che la vive."],
      ["Se senti una storia interessante, raccontala agli altri.","Ci vediamo in piazza."]
    ]
    return common[i%common.size()]
}



func _ready() -> void:
    rng.randomize()
    target = position
    home = position
    wait = rng.randf_range(1.0, 3.0)
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)
    $Prompt.visible = false
    queue_redraw()

func _process(delta: float) -> void:
    phase += delta
    if wait > 0.0:
        wait -= delta
    elif position.distance_to(target) < 8.0:
        target = home + Vector2(rng.randf_range(-wander_radius,wander_radius), rng.randf_range(-wander_radius,wander_radius))
        wait = rng.randf_range(1.0, 2.5)
    else:
        position = position.move_toward(target, 18.0 * delta)
    if player_near and Input.is_action_just_pressed("interact"):
        interact()
    queue_redraw()

func _on_body_entered(body: Node) -> void:
    if body.name == "Player":
        player_near = true
        $Prompt.visible = true

func _on_body_exited(body: Node) -> void:
    if body.name == "Player":
        player_near = false
        $Prompt.visible = false

func interact() -> void:
    var hud = get_tree().current_scene.get_node_or_null("HUD")
    if dialogue.is_empty():
        return
    if hud and hud.has_method("show_dialogue"):
        hud.show_dialogue(citizen_name, dialogue[dialogue_index])
    dialogue_index = (dialogue_index + 1) % dialogue.size()

func _draw() -> void:
    var bob := sin(phase * 2.0) * 1.3
    draw_ellipse(Vector2(0,28),Vector2(20,6),Color(0.03,0.02,0.015,0.30))
    draw_circle(Vector2(0,-12+bob),16,Color("#d8a16b"))
    draw_rect(Rect2(-15,3+bob,30,31),contrada_color)
    # fascia/sciarpa della Contrada
    draw_rect(Rect2(-17,7+bob,34,7),accent_color)
    draw_rect(Rect2(-12,-29+bob,24,8),accent_color)
    draw_circle(Vector2(-5,-13+bob),2.4,Color("#241914"))
    draw_circle(Vector2(5,-13+bob),2.4,Color("#241914"))
    if player_near:
        draw_arc(Vector2.ZERO,31.0+sin(phase*5.0)*2.0,-PI*0.85,-PI*0.15,18,Color(1,0.86,0.42,0.85),2)

func draw_ellipse(center: Vector2,radii: Vector2,color: Color) -> void:
    var pts := PackedVector2Array()
    for i in 20:
        var a := TAU*float(i)/20.0
        pts.append(center+Vector2(cos(a)*radii.x,sin(a)*radii.y))
    draw_colored_polygon(pts,color)

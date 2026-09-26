extends Node

const NPC_DATA := {
    "cervia":[
        ["Archivista di Porta Beltrame",0,"La Cervia custodisce la Torre di Beltrame. Prima cerca il primo segno sulle pietre."],
        ["Vecchio della Torre",1,"Hai trovato il primo segno. Ora cerca la campanella spezzata: il secondo indizio indica il sentiero sicuro."],
        ["Campanaro di Beltrame",2,"Le tre tacche sulla torre confermano la storia. Ora puoi affrontare la scalata fino alla campana."]
    ],
    "leondoro":[
        ["Archeologo di Marzocchino",0,"La Tana del Leone non si trova correndo a caso. Cerca la prima impronta."],
        ["Vecchio del Leone",1,"L'impronta ti ha portato qui. Il nastro rosso indica il secondo passaggio."],
        ["Guardiano della Tana",2,"Hai ricostruito la pista. Nella tana dovrai resistere per trenta secondi."]
    ],
    "lucertola":[
        ["Vecchio della Ripa",0,"La Via della Ripa comincia da una pietra con la lucertola incisa."],
        ["Sentinella della Ripa",1,"Il primo segno è autentico. Cerca il secondo: indica il bivio meno luminoso."],
        ["Cantastorie della Ripa",2,"Ora conosci la sequenza. Al bivio, scegli la strada che gli indizi hanno indicato."]
    ],
    "madonnina":[
        ["Storica dei Pagliai",0,"Nel Pagliaio Perduto sono nascosti simboli. Il primo è vicino ai covoni."],
        ["Ragazza del Pagliaio",1,"Hai trovato il primo simbolo. Il secondo è più difficile: memorizza ciò che vedi."],
        ["Custode della Chiesina",2,"La storia è completa. Nella prova dovrai ricordare il simbolo corretto."]
    ],
    "ponte":[
        ["Vecchio del Ponte",0,"Il Ponte di Tavole ha un ritmo. Cerca la prima asse sicura."],
        ["Guardiano del Fosso",1,"La prima asse regge. Il nodo sulla corda rivela il secondo passaggio."],
        ["Maestro dei Musici",2,"Hai capito il ritmo. Ora attraversa prima che il ponte ceda."]
    ],
    "pozzo":[
        ["Archeologo del Pozzo",0,"Nel Pozzo è rimasta una storia incompleta. La prima traccia è vicino al secchio."],
        ["Custode del Vaso",1,"Acqua e pietra raccontano la seconda parte. Cerca la pietra bagnata."],
        ["Cronista del Miccio",2,"Ora hai tutti gli elementi. Ricostruisci nell'ordine il Mistero del Miccio."]
    ],
    "quercia":[
        ["Custode delle Querce",0,"Il bosco non mostra il suo segreto a chi corre senza guardare. Cerca il primo segno."],
        ["Vecchio del Comunello",1,"Il primo segno è solo l'inizio. Il nastro dorato indica una deviazione."],
        ["Custode della Passione",2,"Le tre tracce sono complete. La Quercia Antica è il culmine della prova."]
    ],
    "ranocchio":[
        ["Vecchio del Ranocchiaio",0,"Segui le tracce delle rane fino al primo segno vicino allo stagno."],
        ["Pastore delle Apuane",1,"Le impronte indicano la sequenza delle ninfee. Guarda bene il prossimo salto."],
        ["Custode del Loto",2,"La storia ti ha portato al Loto d'Oro. Ora attraversa la palude senza cadere."]
    ]
}

var current_map := ""
var world: Node = null

func _ready() -> void:
    await get_tree().process_frame
    world = get_tree().current_scene.get_node_or_null("World")
    if world:
        if world.has_signal("map_changed"):
            world.map_changed.connect(_on_map_changed)
        _rebuild_npcs(world.current_map_id)
    _rebuild_citizens(world.current_map_id)

func _on_map_changed(map_id: String) -> void:
    _rebuild_npcs(map_id)
    _rebuild_citizens(map_id)

func _rebuild_npcs(map_id: String) -> void:
    if not world:
        return
    current_map = map_id
    var script_ref = load("res://scripts/world/NarrativeNPC.gd")
    for child in world.map_nodes.get_children():
        if child.get_script() == script_ref:
            child.queue_free()

    var data: Array = NPC_DATA.get(map_id, [])
    var positions := [Vector2(360,300), Vector2(700,470), Vector2(950,250)]
    for i in data.size():
        var npc := Area2D.new()
        npc.set_script(script_ref)
        npc.name = "NarrativeNPC%d" % (i + 1)
        npc.contrada_id = map_id
        npc.stage_required = i
        npc.npc_name = str(data[i][0])
        npc.dialogue = str(data[i][2])
        npc.position = positions[i]
        var shape := CollisionShape2D.new()
        var circle := CircleShape2D.new()
        circle.radius = 48.0
        shape.shape = circle
        npc.add_child(shape)
        world.map_nodes.add_child(npc)


func _rebuild_citizens(map_id: String) -> void:
    if not world:
        return
    var citizen_script = load("res://scripts/Citizens.gd")
    for child in world.map_nodes.get_children():
        if child.get_script() == citizen_script:
            child.queue_free()

    var theme_data: Dictionary = {
        "cervia":[Color("#f1eee1"),Color("#7eb7c7")],
        "leondoro":[Color("#e6c63f"),Color("#c94f45")],
        "lucertola":[Color("#c84f45"),Color("#4f8d4b")],
        "madonnina":[Color("#416ea8"),Color("#e2bf3b")],
        "ponte":[Color("#c84e48"),Color("#416ea8")],
        "pozzo":[Color("#eee9dc"),Color("#c84f45")],
        "quercia":[Color("#3f6f45"),Color("#d4af37")],
        "ranocchio":[Color("#e2c83f"),Color("#4f8c4e")]
    }
    var colors: Array = theme_data.get(map_id, theme_data["quercia"])
    var names := ["Abitante della Contrada","Ragazza della Piazza","Anziano della Contrada","Artigiano","Contradaiola","Ragazzo del Borgo"]
    var positions := [
        Vector2(160,150), Vector2(300,560), Vector2(520,160),
        Vector2(760,560), Vector2(930,150), Vector2(1100,560)
    ]

    for i in positions.size():
        var citizen := Area2D.new()
        citizen.set_script(citizen_script)
        citizen.name = "Cittadino_%02d" % (i + 1)
        citizen.citizen_name = names[i]
        citizen.contrada_id = map_id
        citizen.contrada_color = colors[0]
        citizen.accent_color = colors[1]
        citizen.dialogue = [
            "La Contrada è più grande della piazza. Guarda anche i sentieri laterali.",
            "Hai già parlato con gli abitanti? Ognuno conosce un pezzo della storia."
        ]
        citizen.wander_radius = 45.0 + float(i % 3) * 20.0
        citizen.position = positions[i]

        var shape_node := CollisionShape2D.new()
        var shape := CircleShape2D.new()
        shape.radius = 30.0
        shape_node.shape = shape
        citizen.add_child(shape_node)

        world.map_nodes.add_child(citizen)

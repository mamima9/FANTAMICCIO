extends Node2D

@onready var trial_game: CanvasLayer = $TrialGame

const WORLD_SIZE := Vector2(2304, 1296)
const PLAYER_START := Vector2(1150, 850)
var contrada_id := "quercia"
const REGIONAL_NAMES := {
    "cervia":"LA CERVIA  •  BELTRAME",
    "leondoro":"IL LEON D'ORO  •  MARZOCCHINO",
    "lucertola":"LA LUCERTOLA  •  LA RIPA",
    "madonnina":"LA MADONNINA",
    "ponte":"IL PONTE",
    "pozzo":"IL POZZO",
    "quercia":"LA QUERCIA  •  QUERCETA",
    "ranocchio":"IL RANOCCHIO"
}
const REGIONAL_LOCATIONS := {
    "cervia":"BOSCHI DI BELTRAME","leondoro":"MARZOCCHINO","lucertola":"LA RIPA",
    "madonnina":"CORTILI DELLA MADONNINA","ponte":"VIE DEL PONTE","pozzo":"PIAZZE DEL POZZO",
    "quercia":"BOSCO DELLA QUERCIA","ranocchio":"STAGNI DEL RANOCCHIO"
}

@onready var player: CharacterBody2D = $Player
@onready var map: Sprite2D = $Map
@onready var prompt: Label = $HUD/Prompt
@onready var title: Label = $HUD/Title
@onready var beniamino: Area2D = $Beniamino
@onready var quest: Node = $QuestManager

func _ready() -> void:
    contrada_id = _read_contrada()
    $RegionalWorld.set_contrada(contrada_id)
    $Citizens.set_contrada(contrada_id)
    trial_game.won.connect(_on_trial_won)
    trial_game.failed.connect(_on_trial_failed)

    map.position = WORLD_SIZE * 0.5
    if map.texture:
        map.scale = WORLD_SIZE / map.texture.get_size()

    title.text = REGIONAL_NAMES.get(contrada_id, REGIONAL_NAMES["quercia"])
    prompt.text = "Esplora liberamente  •  parla con i contradaioli  •  scopri indizi e luoghi"
    player.position = Vector2(1150, 850)

    $Player/Camera2D.enabled = true
    $Player/Camera2D.position_smoothing_enabled = false
    $Player/Camera2D.position = Vector2.ZERO
    $Player/Camera2D.zoom = Vector2(1.0, 1.0)

    if $HUD.has_method("set_location"):
        $HUD.set_location(REGIONAL_LOCATIONS.get(contrada_id, "QUERCETA"), quest.get_objective())
    if $HUD.has_method("set_progress"):
        $HUD.set_progress("INDIZI  •  BENIAMINI", "0 / 3  •  0 / 8")
    refresh_objective()
    if $QuestWorld.has_method("set_contrada"):
        $QuestWorld.set_contrada(contrada_id)
    if $QuestWorld.has_method("refresh"):
        $QuestWorld.refresh()

func _process(_delta: float) -> void:
    _update_mobile_context()

func _update_mobile_context() -> void:
    var hud = get_node_or_null("HUD")
    if not hud or not hud.has_method("set_mobile_interaction"):
        return
    var found := ""
    for child in $NPCs.get_children():
        if child is Area2D and child.get("player_near") == true:
            found = "PARLA"
            break
    if found == "":
        for child in $WorldInteractables.get_children():
            if child is Area2D and child.get("player_near") == true:
                found = "OSSERVA"
                break
    if found == "":
        var qw = get_node_or_null("QuestWorld")
        if qw and qw.get("player_near") != -1:
            found = "SCOPRI"
    hud.set_mobile_interaction(found != "", found)

func mobile_interact() -> void:
    var npc = get_node_or_null("NPCs")
    if npc:
        for child in npc.get_children():
            if child is Area2D and child.has_method("interact") and child.player_near:
                child.interact()
                return
    var world = get_node_or_null("WorldInteractables")
    if world:
        for child in world.get_children():
            if child is Area2D and child.has_method("interact") and child.player_near:
                child.interact()
                return
    var qw = get_node_or_null("QuestWorld")
    if qw and qw.has_method("_interact"):
        qw._interact()

func refresh_objective() -> void:
    if $HUD.has_method("set_location"):
        $HUD.set_location(REGIONAL_LOCATIONS.get(contrada_id, "QUERCETA"), quest.get_objective())
    if $HUD.has_method("set_progress"):
        $HUD.set_progress("INDIZI  •  BENIAMINI", "%d / 3  •  0 / 8" % quest.discoveries)

func start_trial(id: String) -> void:
    if Challenges.get_challenge(id).is_empty():
        return
    if quest and quest.has_method("can_start_trial") and not quest.can_start_trial(id):
        $HUD.show_toast("Prima completa tutti e 3 gli indizi del bosco.")
        return
    if $HUD.has_method("show_trial_intro"):
        $HUD.show_trial_intro(Challenges.get_challenge(id).get("title", "PROVA"), Challenges.get_challenge(id).get("goal", ""))
    trial_game.start(id)
    player.visible = false
    player.set_physics_process(false)
    $Player/Camera2D.enabled = false

func _on_trial_won(id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Player/Camera2D.enabled = true
    $Player/Camera2D.position = Vector2.ZERO
    beniamino.beniamino_id = id
    beniamino.position = Vector2(1740, 520)
    beniamino.reveal()
    quest.mark_complete()
    $HUD.show_toast("PROVA SUPERATA  •  Il Beniamino è apparso nel bosco!")

func _on_trial_failed(_id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Player/Camera2D.enabled = true
    $Player/Camera2D.position = Vector2.ZERO
    $HUD.show_toast("La prova ti aspetta ancora. Riprova quando vuoi.")


func _read_contrada() -> String:
    if OS.has_feature("web"):
        var value = JavaScriptBridge.eval("new URLSearchParams(window.location.search).get('contrada') || ''")
        if value != null and REGIONAL_NAMES.has(str(value).to_lower()):
            return str(value).to_lower()
    return "quercia"

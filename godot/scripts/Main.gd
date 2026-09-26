extends Node2D

@onready var trial_game: CanvasLayer = $TrialGame

const WORLD_SIZE := Vector2(2304, 1296)
const PLAYER_START := Vector2(600, 900)

@onready var player: CharacterBody2D = $Player
@onready var map: Sprite2D = $Map
@onready var prompt: Label = $HUD/Prompt
@onready var title: Label = $HUD/Title
@onready var beniamino: Area2D = $Beniamino
@onready var quest: Node = $QuestManager

func _ready() -> void:
    trial_game.won.connect(_on_trial_won)
    trial_game.failed.connect(_on_trial_failed)

    map.position = WORLD_SIZE * 0.5
    if map.texture:
        map.scale = WORLD_SIZE / map.texture.get_size()

    player.position = PLAYER_START
    title.text = "LA QUERCIA  •  QUERCETA"
    prompt.text = "Esplora il bosco  •  avvicinati agli abitanti  •  E per parlare"

    $Player/Camera2D.enabled = true
    $Player/Camera2D.position_smoothing_enabled = false
    $Player/Camera2D.global_position = player.global_position
    $Player/Camera2D.zoom = Vector2(1.0, 1.0)

    if $HUD.has_method("set_location"):
        $HUD.set_location("BOSCO DELLA QUERCIA", "Trova gli indizi degli abitanti")
    if $HUD.has_method("set_progress"):
        $HUD.set_progress("BENIAMINI", "0 / 8")
    refresh_objective()

func refresh_objective() -> void:
    if $HUD.has_method("set_location"):
        $HUD.set_location("BOSCO DELLA QUERCIA", quest.get_objective())

func _process(_delta: float) -> void:
    if not trial_game.active:
        $Player/Camera2D.position = player.position

func start_trial(id: String) -> void:
    if Challenges.get_challenge(id).is_empty():
        return
    if $HUD.has_method("show_trial_intro"):
        $HUD.show_trial_intro(Challenges.get_challenge(id).get("title", "PROVA"), Challenges.get_challenge(id).get("goal", ""))
    trial_game.start(id)
    player.visible = false
    player.set_physics_process(false)
    $Player/Camera2D.enabled = false

func start_quercia_trial() -> void:
    start_trial("quercia")

func _on_trial_won(id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Player/Camera2D.enabled = true
    beniamino.beniamino_id = id
    beniamino.position = Vector2(1740, 520)
    beniamino.reveal()
    quest.mark_complete()
    $HUD.show_toast("PROVA SUPERATA  •  Il Beniamino è apparso nel bosco!")

func _on_trial_failed(_id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Player/Camera2D.enabled = true
    $HUD.show_toast("La prova ti aspetta ancora. Riprova quando vuoi.")

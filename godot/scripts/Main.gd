extends Node2D

@onready var trial_game: CanvasLayer = $TrialGame

const WORLD_SIZE := Vector2(2304, 1296)
const PLAYER_START := Vector2(1152, 760)

@onready var player: CharacterBody2D = $Player
@onready var map: Sprite2D = $Map
@onready var prompt: Label = $HUD/Prompt
@onready var title: Label = $HUD/Title

func _ready() -> void:
    trial_game.won.connect(_on_trial_won)
    trial_game.failed.connect(_on_trial_failed)
    map.position = WORLD_SIZE * 0.5
    map.scale = WORLD_SIZE / map.texture.get_size()
    player.position = PLAYER_START
    title.text = "LA QUERCIA  •  QUERCETA"
    prompt.text = "JOYSTICK / WASD / FRECCE  •  E per interagire"
    $Camera2D.position = player.position

func _process(_delta: float) -> void:
    if not trial_game.active:
        $Camera2D.position = player.position

func start_trial(id: String) -> void:
    if Challenges.get_challenge(id).is_empty():
        return
    trial_game.start(id)
    player.visible = false
    player.set_physics_process(false)
    $Camera2D.enabled = false

func start_quercia_trial() -> void:
    start_trial("quercia")

func _on_trial_won(id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Camera2D.enabled = true
    $HUD.show_toast("PROVA SUPERATA!  Beniamino: " + id)

func _on_trial_failed(_id: String) -> void:
    player.visible = true
    player.set_physics_process(true)
    $Camera2D.enabled = true
    $HUD.show_toast("Prova fallita. Puoi riprovare.")

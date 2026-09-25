extends Node2D\n\n@onready var challenge_manager: Node = $ChallengeManager

const WORLD_SIZE := Vector2(2304, 1296)
const PLAYER_START := Vector2(1152, 760)

@onready var player: CharacterBody2D = $Player
@onready var map: Sprite2D = $Map
@onready var prompt: Label = $HUD/Prompt
@onready var title: Label = $HUD/Title

func _ready() -> void:
    challenge_manager.challenge_started.connect(_on_challenge_started)
    challenge_manager.challenge_won.connect(_on_challenge_won)
    challenge_manager.challenge_failed.connect(_on_challenge_failed)
    map.position = WORLD_SIZE * 0.5
    player.position = PLAYER_START
    title.text = "LA QUERCIA  •  QUERCETA"
    prompt.text = "WASD / FRECCE  •  E per interagire"
    $Camera2D.position = player.position

func _process(_delta: float) -> void:
    $Camera2D.position = player.position

func start_quercia_trial() -> void:
    challenge_manager.start("quercia")

func _on_challenge_started(id: String) -> void:
    $HUD.show_toast("PROVA: " + Challenges.get_challenge(id).get("title", ""))

func _on_challenge_won(id: String) -> void:
    $HUD.show_toast("PROVA SUPERATA!  Beniamino: " + id)

func _on_challenge_failed(id: String) -> void:
    $HUD.show_toast("Prova fallita. Riprova.")

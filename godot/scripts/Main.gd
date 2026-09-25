extends Node2D

const WORLD_SIZE := Vector2(2304, 1296)
const PLAYER_START := Vector2(1152, 760)

@onready var player: CharacterBody2D = $Player
@onready var map: Sprite2D = $Map
@onready var prompt: Label = $HUD/Prompt
@onready var title: Label = $HUD/Title

func _ready() -> void:
    map.position = WORLD_SIZE * 0.5
    player.position = PLAYER_START
    title.text = "LA QUERCIA  •  QUERCETA"
    prompt.text = "WASD / FRECCE  •  E per interagire"
    $Camera2D.position = player.position

func _process(_delta: float) -> void:
    $Camera2D.position = player.position

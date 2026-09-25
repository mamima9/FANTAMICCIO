extends Node2D
## Procedural challenge controller used by the Godot vertical slice.
## The art can later be replaced by TileMap scenes without changing the game flow.

signal challenge_started(id: String)
signal challenge_won(id: String)
signal challenge_failed(id: String)

var active := false
var challenge_id := ""
var elapsed := 0.0
var target_time := 0.0
var progress := 0.0

func start(id: String) -> void:
    var data = Challenges.get_challenge(id)
    if data.is_empty():
        return
    challenge_id = id
    target_time = float(data.get("time", 60))
    elapsed = 0.0
    progress = 0.0
    active = true
    challenge_started.emit(id)

func _process(delta: float) -> void:
    if not active:
        return
    elapsed += delta
    # Temporary universal progress driver: individual challenge scenes
    # can override this with their own objective logic.
    progress = clamp(elapsed / target_time, 0.0, 1.0)
    if challenge_id == "leondoro" and elapsed >= 30.0:
        win()
    elif elapsed >= target_time:
        if challenge_id in ["ponte", "quercia", "cervia", "ranocchio", "lucertola"]:
            fail()

func win() -> void:
    if not active:
        return
    active = false
    challenge_won.emit(challenge_id)

func fail() -> void:
    if not active:
        return
    active = false
    challenge_failed.emit(challenge_id)

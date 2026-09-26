extends Node

## Global game state shared by the eight Contrade.
var current_map: String = "quercia"
var player_position: Vector2 = Vector2.ZERO
var selected_contrada: String = "quercia"
var collected_beniamini: Dictionary = {}
var discovered_secrets: Dictionary = {}
var completed_trials: Dictionary = {}
var exploration_objectives: Dictionary = {}
var narrative_progress: Dictionary = {}
var game_started: bool = false

func start_game() -> void:
    game_started = true

func set_map(map_id: String) -> void:
    current_map = map_id

func set_player_position(position: Vector2) -> void:
    player_position = position

func unlock_beniamino(contrada_id: String) -> void:
    collected_beniamini[contrada_id] = true

func has_beniamino(contrada_id: String) -> bool:
    return collected_beniamini.get(contrada_id, false)

func beniamino_count() -> int:
    var count := 0
    for id in ["cervia","leondoro","lucertola","madonnina","ponte","pozzo","quercia","ranocchio"]:
        if has_beniamino(id):
            count += 1
    return count

func complete_trial(contrada_id: String) -> void:
    completed_trials[contrada_id] = true

func trial_completed(contrada_id: String) -> bool:
    return completed_trials.get(contrada_id, false)

func discover_secret(secret_id: String) -> void:
    discovered_secrets[secret_id] = true

func secret_discovered(secret_id: String) -> bool:
    return discovered_secrets.get(secret_id, false)

func complete_exploration_step(map_id: String, step: int) -> void:
    var key := str(map_id)
    var current := int(exploration_objectives.get(key, 0))
    if step == current + 1:
        exploration_objectives[key] = step

func exploration_progress(map_id: String) -> int:
    return int(exploration_objectives.get(str(map_id), 0))

func exploration_completed(map_id: String, total_steps: int = 3) -> bool:
    return exploration_progress(map_id) >= total_steps

func narrative_step(map_id: String) -> int:
    return int(narrative_progress.get(str(map_id), 0))

func advance_narrative(map_id: String, step: int) -> void:
    var key := str(map_id)
    var current := narrative_step(key)
    if step > current:
        narrative_progress[key] = step

func season_complete() -> bool:
    return beniamino_count() == 8

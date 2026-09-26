extends Node

## Global game state. This remains independent from individual maps.

var current_map: String = "quercia"
var player_position: Vector2 = Vector2.ZERO
var selected_contrada: String = "quercia"
var collected_beniamini: Dictionary = {}
var discovered_secrets: Dictionary = {}
var completed_trials: Dictionary = {}
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

func complete_trial(contrada_id: String) -> void:
    completed_trials[contrada_id] = true

func trial_completed(contrada_id: String) -> bool:
    return completed_trials.get(contrada_id, false)

func discover_secret(secret_id: String) -> void:
    discovered_secrets[secret_id] = true

func secret_discovered(secret_id: String) -> bool:
    return discovered_secrets.get(secret_id, false)

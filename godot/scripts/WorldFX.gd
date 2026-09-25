extends Node2D

var rng := RandomNumberGenerator.new()
var motes: Array[Vector2] = []
var speeds: Array[float] = []

func _ready() -> void:
    rng.randomize()
    for i in 80:
        motes.append(Vector2(rng.randf_range(80.0,2224.0), rng.randf_range(80.0,1216.0)))
        speeds.append(rng.randf_range(5.0,14.0))
    queue_redraw()

func _process(delta: float) -> void:
    for i in motes.size():
        motes[i].y -= speeds[i] * delta
        if motes[i].y < 70.0:
            motes[i].y = 1220.0
    queue_redraw()

func _draw() -> void:
    for p in motes:
        draw_circle(p, 1.5, Color(1.0,0.91,0.58,0.22))

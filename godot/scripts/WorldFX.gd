extends Node2D

var rng := RandomNumberGenerator.new()
var motes: Array[Vector2] = []
var speeds: Array[float] = []
var phases: Array[float] = []

func _ready() -> void:
    rng.randomize()
    for i in 70:
        motes.append(Vector2(rng.randf_range(80.0,2224.0), rng.randf_range(80.0,1216.0)))
        speeds.append(rng.randf_range(5.0,14.0))
        phases.append(rng.randf_range(0.0, TAU))
    queue_redraw()

func _process(delta: float) -> void:
    for i in motes.size():
        motes[i].y -= speeds[i] * delta
        motes[i].x += sin(Time.get_ticks_msec() * 0.0005 + phases[i]) * 2.5 * delta
        if motes[i].y < 70.0:
            motes[i].y = 1220.0
    queue_redraw()

func _draw() -> void:
    # Soft woodland paths and clearings over the base map.
    draw_polyline(PackedVector2Array([
        Vector2(90,1060), Vector2(350,950), Vector2(600,900),
        Vector2(820,760), Vector2(1030,680), Vector2(1250,650),
        Vector2(1490,560), Vector2(1760,470), Vector2(2110,420)
    ]), Color(0.55,0.40,0.22,0.18), 70.0, true)

    draw_polyline(PackedVector2Array([
        Vector2(430,1120), Vector2(620,1010), Vector2(760,860),
        Vector2(760,610), Vector2(720,430), Vector2(640,300)
    ]), Color(0.72,0.57,0.34,0.16), 46.0, true)

    # Small golden wayfinding marks for the narrative.
    for p in [Vector2(790,520), Vector2(1180,650), Vector2(1560,560)]:
        draw_circle(p, 12.0 + sin(Time.get_ticks_msec()*0.003 + p.x) * 2.0, Color(0.92,0.70,0.25,0.20))
        draw_circle(p, 4.0, Color(0.98,0.82,0.38,0.75))

    # Fireflies / dust.
    for i in motes.size():
        var alpha := 0.12 + 0.10 * sin(Time.get_ticks_msec() * 0.002 + phases[i])
        draw_circle(motes[i], 1.6, Color(1.0,0.91,0.58,alpha))

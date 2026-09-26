extends Node2D

class Critter:
    var pos := Vector2.ZERO
    var vel := Vector2.ZERO
    var home := Vector2.ZERO
    var home_radius := 180.0
    var kind := 0
    var phase := 0.0
    var scale := 1.0
    var pause := 0.0
    var target := Vector2.ZERO
    var fleeing := 0.0

var rng := RandomNumberGenerator.new()
var critters: Array[Critter] = []
var player: Node2D

# Zone pensate per il mondo: uccelli nelle radure, conigli ai margini,
# lucciole vicino all'acqua. Non spawnano più casualmente ovunque.
var zones := [
    Vector2(480, 360), Vector2(980, 520), Vector2(1720, 470),
    Vector2(420, 900), Vector2(1180, 920), Vector2(1920, 820)
]

func _ready() -> void:
    rng.randomize()
    player = get_tree().current_scene.get_node_or_null("Player")
    for i in 12:
        var c := Critter.new()
        c.kind = i % 3
        var zone := zones[i % zones.size()]
        if c.kind == 0:
            zone = zones[(i + 1) % zones.size()]
            c.home_radius = 230.0
        elif c.kind == 1:
            zone = Vector2(350 + (i % 3) * 680, 980 - (i % 2) * 120)
            c.home_radius = 150.0
        else:
            zone = Vector2(1240 + (i % 2) * 300, 360 + (i % 3) * 180)
            c.home_radius = 130.0
        c.home = zone
        c.pos = zone + Vector2(rng.randf_range(-c.home_radius,c.home_radius), rng.randf_range(-c.home_radius,c.home_radius))
        c.pos.x = clamp(c.pos.x, 100.0, 2200.0)
        c.pos.y = clamp(c.pos.y, 110.0, 1180.0)
        c.target = c.pos
        c.phase = rng.randf_range(0.0, TAU)
        c.scale = rng.randf_range(0.75, 1.15)
        c.pause = rng.randf_range(0.2, 2.0)
        critters.append(c)

func _process(delta: float) -> void:
    if not is_instance_valid(player):
        player = get_tree().current_scene.get_node_or_null("Player")
    for c in critters:
        c.phase += delta
        c.pause -= delta
        if player and c.kind != 2:
            var dist := c.pos.distance_to(player.global_position)
            if dist < 110.0:
                var away := (c.pos - player.global_position).normalized()
                c.vel = away * (90.0 if c.kind == 1 else 130.0)
                c.fleeing = 1.2
        if c.fleeing > 0.0:
            c.fleeing -= delta
            c.pos += c.vel * delta
        elif c.pause <= 0.0:
            if c.pos.distance_to(c.home) > c.home_radius:
                c.target = c.home + Vector2(rng.randf_range(-60,60), rng.randf_range(-60,60))
            else:
                c.target = c.home + Vector2(rng.randf_range(-c.home_radius,c.home_radius), rng.randf_range(-c.home_radius,c.home_radius))
            var direction := c.pos.direction_to(c.target)
            var speed := 18.0 if c.kind == 0 else (11.0 if c.kind == 1 else 7.0)
            c.vel = direction * speed
            c.pause = rng.randf_range(1.5, 4.0)
        else:
            c.vel = c.vel.lerp(Vector2.ZERO, delta * 2.0)
        c.pos += c.vel * delta
        c.pos.x = clamp(c.pos.x, 90.0, 2210.0)
        c.pos.y = clamp(c.pos.y, 100.0, 1190.0)
    queue_redraw()

func _draw() -> void:
    for c in critters:
        var bob := sin(c.phase * 5.0) * 2.0
        if c.kind == 0:
            _draw_bird(c.pos + Vector2(0,bob), c.scale)
        elif c.kind == 1:
            _draw_rabbit(c.pos + Vector2(0,bob), c.scale)
        else:
            _draw_firefly(c.pos + Vector2(0,bob), c.scale)

func _draw_bird(p: Vector2, s: float) -> void:
    var flap := sin(Time.get_ticks_msec() * 0.012) * 4.0 * s
    draw_arc(p + Vector2(-6,flap), 9*s, 3.3, 5.9, 8, Color("#3a3026"), 2)
    draw_arc(p + Vector2(6,-flap), 9*s, 0.5, 2.7, 8, Color("#3a3026"), 2)
    draw_circle(p, 4*s, Color("#6c5a46"))
    draw_colored_polygon(PackedVector2Array([p+Vector2(4,0),p+Vector2(11,3),p+Vector2(4,5)]),Color("#d5a34b"))

func _draw_rabbit(p: Vector2, s: float) -> void:
    draw_ellipse(p+Vector2(0,7),Vector2(13,7)*s,Color(0.05,0.04,0.03,0.28))
    draw_circle(p,9*s,Color("#d8c5a5"))
    draw_circle(p+Vector2(-6,-8),4*s,Color("#d8c5a5"))
    draw_circle(p+Vector2(6,-8),4*s,Color("#d8c5a5"))
    draw_circle(p+Vector2(-3,-1),1.5*s,Color("#2a211b"))
    draw_circle(p+Vector2(3,-1),1.5*s,Color("#2a211b"))

func _draw_firefly(p: Vector2, s: float) -> void:
    var glow := 0.25 + sin(Time.get_ticks_msec()*0.004 + p.x)*0.18
    draw_circle(p,3.0*s,Color(1.0,0.87,0.42,glow))
    draw_circle(p,1.2*s,Color(1.0,0.92,0.58,0.9))

func draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
    var points := PackedVector2Array()
    for i in 20:
        var a := TAU * float(i)/20.0
        points.append(center+Vector2(cos(a)*radii.x,sin(a)*radii.y))
    draw_colored_polygon(points,color)

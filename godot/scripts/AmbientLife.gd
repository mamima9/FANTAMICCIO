extends Node2D

class Critter:
    var pos := Vector2.ZERO
    var vel := Vector2.ZERO
    var kind := 0
    var phase := 0.0
    var scale := 1.0
    var home := Vector2.ZERO
    var zone := Vector2.ZERO
    var speed := 20.0
    var pause := 0.0

var rng := RandomNumberGenerator.new()
var critters: Array[Critter] = []

# Zone coerenti con la mappa:
# conigli nelle radure basse, uccelli vicino alle chiome,
# lucciole concentrate intorno allo stagno e alle zone umide.
var zones := [
    [Vector2(430,930), Vector2(260,180), 1],
    [Vector2(760,1040), Vector2(300,170), 1],
    [Vector2(1810,540), Vector2(260,150), 1],
    [Vector2(520,260), Vector2(330,150), 0],
    [Vector2(1500,250), Vector2(420,170), 0],
    [Vector2(1240,350), Vector2(240,150), 2],
    [Vector2(1600,900), Vector2(350,180), 2]
]

func _ready() -> void:
    rng.randomize()
    for zone in zones:
        for i in 2:
            var c := Critter.new()
            c.zone = zone[1]
            c.home = zone[0]
            c.kind = zone[2]
            c.pos = c.home + Vector2(rng.randf_range(-c.zone.x, c.zone.x), rng.randf_range(-c.zone.y, c.zone.y))
            c.vel = Vector2.from_angle(rng.randf_range(0.0, TAU)) * rng.randf_range(8.0, 18.0)
            c.phase = rng.randf_range(0.0, TAU)
            c.scale = rng.randf_range(0.75, 1.10)
            c.speed = rng.randf_range(12.0, 24.0)
            critters.append(c)
    queue_redraw()

func _process(delta: float) -> void:
    var player := get_tree().current_scene.get_node_or_null("Player")

    for c in critters:
        c.phase += delta

        if c.pause > 0.0:
            c.pause -= delta
        else:
            c.pos += c.vel * delta

        var rel := c.pos - c.home
        if abs(rel.x) > c.zone.x or abs(rel.y) > c.zone.y:
            var target := c.home + Vector2(rng.randf_range(-c.zone.x * 0.6, c.zone.x * 0.6), rng.randf_range(-c.zone.y * 0.6, c.zone.y * 0.6))
            c.vel = (target - c.pos).normalized() * c.speed

        # Gli animali reagiscono al giocatore senza diventare NPC:
        # scappano leggermente se ci si avvicina troppo.
        if player and c.kind == 1 and c.pos.distance_to(player.global_position) < 90.0:
            c.vel = (c.pos - player.global_position).normalized() * (c.speed * 1.8)
            c.pause = 0.2

        if rng.randf() < delta * 0.12:
            c.vel = Vector2.from_angle(rng.randf_range(0.0, TAU)) * c.speed
            c.pause = rng.randf_range(0.2, 1.0)

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

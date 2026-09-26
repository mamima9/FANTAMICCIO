extends Node2D

class Critter:
    var pos := Vector2.ZERO
    var vel := Vector2.ZERO
    var kind := 0
    var phase := 0.0
    var scale := 1.0

var rng := RandomNumberGenerator.new()
var critters: Array[Critter] = []

func _ready() -> void:
    rng.randomize()
    for i in 10:
        var c := Critter.new()
        c.pos = Vector2(rng.randf_range(180.0, 2150.0), rng.randf_range(170.0, 1120.0))
        c.vel = Vector2.from_angle(rng.randf_range(0.0, TAU)) * rng.randf_range(8.0, 22.0)
        c.kind = i % 3
        c.phase = rng.randf_range(0.0, TAU)
        c.scale = rng.randf_range(0.75, 1.15)
        critters.append(c)
    queue_redraw()

func _process(delta: float) -> void:
    for c in critters:
        c.pos += c.vel * delta
        c.phase += delta
        if c.pos.x < 120 or c.pos.x > 2180:
            c.vel.x *= -1
        if c.pos.y < 120 or c.pos.y > 1170:
            c.vel.y *= -1
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

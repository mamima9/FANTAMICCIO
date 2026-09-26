extends Node2D

# Collisioni coerenti con gli elementi realmente disegnati.
# I sentieri restano sempre attraversabili: gli alberi vicini ai percorsi
# vengono esclusi automaticamente dal sistema di collisione.

var pulse := 0.0
@export var contrada_id := "quercia"

# Identità ambientale delle otto Contrade. Le future mappe riutilizzano
# questo stesso sistema invece di avere decorazioni generiche.
const REGIONAL_THEMES := {
    "cervia": {"element":"CERVI", "habitat":"bosco aperto"},
    "lucertola": {"element":"LUCERTOLE", "habitat":"RIPA"},
    "madonnina": {"element":"PAGLIAI", "habitat":"cortili e campi"},
    "quercia": {"element":"QUERCE", "habitat":"bosco"},
    "leondoro": {"element":"LEONCINI", "habitat":"marzocchino"},
    "ponte": {"element":"PONTI", "habitat":"passaggi e corsi d’acqua"},
    "pozzo": {"element":"POZZI", "habitat":"piazze e cortili"},
    "ranocchio": {"element":"STAGNI E RANE", "habitat":"zone umide"}
}

var trees := [
    Vector2(150,150), Vector2(330,255), Vector2(520,145), Vector2(700,190),
    Vector2(920,125), Vector2(1370,145), Vector2(1570,220), Vector2(1800,130),
    Vector2(2050,230), Vector2(2180,120), Vector2(180,1010), Vector2(390,1130),
    Vector2(620,1030), Vector2(850,1150), Vector2(1090,1060), Vector2(1370,1120),
    Vector2(1600,1020), Vector2(1840,1130), Vector2(2090,1020), Vector2(2210,1160),
    Vector2(280,505), Vector2(505,720), Vector2(760,520), Vector2(1560,470),
    Vector2(1810,610), Vector2(2070,510), Vector2(1440,820), Vector2(1880,820)
]

var rocks := [
    Vector2(430,430), Vector2(570,560), Vector2(900,470), Vector2(1010,850),
    Vector2(1260,510), Vector2(1650,700), Vector2(1940,450), Vector2(2020,760)
]

var benches := [Vector2(910,720), Vector2(1320,930), Vector2(1660,560)]
var secret_groves := [Vector2(300, 760), Vector2(1850, 930), Vector2(2050, 350)]

var fences := [
    [Vector2(560,330), Vector2(680,330)],
    [Vector2(880,930), Vector2(1010,930)],
    [Vector2(1600,330), Vector2(1710,330)]
]

var paths := [
    [Vector2(90,1060),Vector2(350,950),Vector2(600,900),Vector2(820,760),Vector2(1030,680),Vector2(1250,650),Vector2(1490,560),Vector2(1760,470),Vector2(2110,420)],
    [Vector2(430,1120),Vector2(620,1010),Vector2(760,860),Vector2(760,610),Vector2(720,430),Vector2(640,300)],
    [Vector2(1020,680),Vector2(1100,820),Vector2(1320,930),Vector2(1530,960)]
]

func _ready() -> void:
    _build_collisions()
    queue_redraw()

func _process(delta: float) -> void:
    pulse += delta
    queue_redraw()

func _build_collisions() -> void:
    for p in trees:
        # Lasciamo completamente liberi i corridoi dei sentieri.
        if _near_any_path(p, 70.0):
            continue
        _circle_collision(p + Vector2(0, 8), 23.0, "Tree")

    for p in rocks:
        _circle_collision(p, 18.0, "Rock")

    # La vegetazione non deve creare muri invisibili sulle zone esplorabili.
    # Le recinzioni sono invece ostacoli lineari reali.
    for fence in fences:
        _segment_collision(fence[0], fence[1], 10.0, "Fence")

    # Piccoli tronchi delle radure segrete: ostacoli leggibili, non muri.
    for p in secret_groves:
        _circle_collision(p, 11.0, "SecretGroveTree")

func _near_any_path(point: Vector2, distance: float) -> bool:
    for path in paths:
        for i in range(path.size() - 1):
            if _distance_to_segment(point, path[i], path[i + 1]) <= distance:
                return true
    return false

func _distance_to_segment(p: Vector2, a: Vector2, b: Vector2) -> float:
    var ab := b - a
    var length_sq := ab.length_squared()
    if length_sq <= 0.001:
        return p.distance_to(a)
    var t := clamp((p - a).dot(ab) / length_sq, 0.0, 1.0)
    return p.distance_to(a.lerp(b, t))

func _circle_collision(pos: Vector2, radius: float, label: String) -> void:
    var body := StaticBody2D.new()
    body.position = pos
    body.name = label
    var shape := CollisionShape2D.new()
    var circle := CircleShape2D.new()
    circle.radius = radius
    shape.shape = circle
    body.add_child(shape)
    add_child(body)

func _segment_collision(a: Vector2, b: Vector2, thickness: float, label: String) -> void:
    var body := StaticBody2D.new()
    body.position = (a + b) * 0.5
    body.name = label
    var shape := CollisionShape2D.new()
    var rect := RectangleShape2D.new()
    rect.size = Vector2(a.distance_to(b), thickness)
    shape.shape = rect
    shape.rotation = (b - a).angle()
    body.add_child(shape)
    add_child(body)

func _draw() -> void:
    draw_circle(Vector2(760,620), 155.0, Color(0.45,0.63,0.36,0.16))
    draw_circle(Vector2(1490,690), 180.0, Color(0.43,0.60,0.34,0.13))
    draw_circle(Vector2(1120,820), 150.0, Color(0.52,0.68,0.40,0.11))

    for path in paths:
        _path(path, 72.0)

    for p in trees:
        _draw_tree(p)
    for p in rocks:
        _draw_rock(p)
    for p in benches:
        _draw_bench(p)
    for fence in fences:
        _draw_fence(fence[0], fence[1])

    # Quercia: il territorio deve avere una firma visiva riconoscibile.
    if contrada_id == "quercia":
        for p in secret_groves:
            _draw_oak_marker(p)
        _draw_oak_grove(Vector2(300, 760), 1.0)
        _draw_oak_grove(Vector2(1850, 930), 0.85)

func _draw_oak_marker(p: Vector2) -> void:
    draw_circle(p + Vector2(0, 16), 22.0, Color(0.10,0.18,0.08,0.18))
    draw_circle(p, 4.0, Color("#d4af37"))
    draw_arc(p, 12.0 + sin(pulse * 3.0) * 2.0, 0.0, TAU, 18, Color(1,0.82,0.30,0.32), 2.0)

func _draw_oak_grove(center: Vector2, s: float) -> void:
    for i in 5:
        var angle := TAU * float(i) / 5.0
        var p := center + Vector2(cos(angle) * 58.0, sin(angle) * 38.0)
        _draw_tree(p)
    draw_arc(center + Vector2(0,18), 86.0 * s, 0.0, TAU, 32, Color(0.86,0.72,0.34,0.18), 2.0)

func _path(points: Array, width: float) -> void:
    var packed := PackedVector2Array(points)
    draw_polyline(packed, Color(0.25,0.18,0.11,0.25), width + 18.0, true)
    draw_polyline(packed, Color("#b9955e"), width, true)
    draw_polyline(packed, Color("#d9bb82"), width - 12.0, true)

func _draw_tree(p: Vector2) -> void:
    draw_ellipse(p + Vector2(0,36), Vector2(42,13), Color(0.06,0.10,0.05,0.24))
    draw_rect(Rect2(p.x - 9,p.y - 8,18,52), Color("#67452e"))
    draw_rect(Rect2(p.x - 5,p.y + 8,10,34), Color("#81583a"))
    draw_circle(p + Vector2(-25,-25), 35, Color("#315f39"))
    draw_circle(p + Vector2(22,-28), 39, Color("#3e7843"))
    draw_circle(p + Vector2(0,-57), 42, Color("#4c8a49"))
    draw_circle(p + Vector2(-10,-64), 13, Color(0.55,0.70,0.34,0.35))
    draw_circle(p + Vector2(18,-43), 9, Color(0.65,0.78,0.40,0.22))

func _draw_rock(p: Vector2) -> void:
    draw_ellipse(p + Vector2(0,8), Vector2(18,7), Color(0.05,0.08,0.04,0.20))
    var pts := PackedVector2Array([p+Vector2(-18,5),p+Vector2(-12,-8),p+Vector2(0,-14),p+Vector2(17,-6),p+Vector2(13,7),p+Vector2(-4,11)])
    draw_colored_polygon(pts, Color("#6e725f"))
    draw_line(p+Vector2(-8,-5),p+Vector2(8,-8),Color("#92947d"),2)

func _draw_bench(p: Vector2) -> void:
    draw_rect(Rect2(p+Vector2(-25,0),Vector2(50,8)),Color("#69462d"))
    draw_rect(Rect2(p+Vector2(-20,-14),Vector2(40,9)),Color("#805638"))
    draw_rect(Rect2(p+Vector2(-18,7),Vector2(5,12)),Color("#4e3627"))
    draw_rect(Rect2(p+Vector2(13,7),Vector2(5,12)),Color("#4e3627"))

func _draw_fence(a: Vector2,b: Vector2) -> void:
    draw_line(a,b,Color("#68472e"),7)
    for i in 4:
        var t := float(i)/3.0
        var p := a.lerp(b,t)
        draw_rect(Rect2(p-Vector2(4,10),Vector2(8,22)),Color("#785236"))

func _draw_ellipse(center: Vector2,radii: Vector2,color: Color) -> void:
    var pts := PackedVector2Array()
    for i in 24:
        var a := TAU*float(i)/24.0
        pts.append(center+Vector2(cos(a)*radii.x,sin(a)*radii.y))
    draw_colored_polygon(pts,color)

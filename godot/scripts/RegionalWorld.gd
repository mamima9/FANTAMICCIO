extends Node2D
## World renderer for all eight Contrade. One engine, eight distinct identities.
@export var contrada_id := "quercia"
var pulse := 0.0
const SIZE := Vector2(2304,1296)

const DATA := {
 "cervia":{"name":"LA CERVIA","place":"BOSCHI DI BELTRAME","ground":Color("#769a59"),road":Color("#c7aa72"),primary":Color("#f1eee1"),secondary":Color("#7eb7c7"),accent":Color("#d4af37"),landmark":"TORRE DI BELTRAME"},
 "leondoro":{"name":"IL LEON D'ORO","place":"MARZOCCHINO","ground":Color("#9b8155"),road":Color("#d3b77a"),primary":Color("#e6c63f"),secondary":Color("#c94f45"),accent":Color("#315c8c"),landmark":"TANA DEL LEONE"},
 "lucertola":{"name":"LA LUCERTOLA","place":"LA RIPA","ground":Color("#8c8760"),road":Color("#c9b27d"),primary":Color("#c84f45"),secondary":Color("#4f8d4b"),accent":Color("#e3c63f"),landmark":"RIPA DEL MICCIO"},
 "madonnina":{"name":"LA MADONNINA","place":"CORTILI DELLA MADONNINA","ground":Color("#b7a16b"),road":Color("#e1c78d"),primary":Color("#416ea8"),secondary":Color("#e2bf3b"),accent":Color("#c94f45"),landmark":"PAGLIAIO PERDUTO"},
 "ponte":{"name":"IL PONTE","place":"VIE DEL PONTE","ground":Color("#6f9872"),road":Color("#c7a976"),primary":Color("#c84e48"),secondary":Color("#416ea8"),accent":Color("#e2bf3b"),landmark":"PONTE DI TAVOLE"},
 "pozzo":{"name":"IL POZZO","place":"PIAZZE DEL POZZO","ground":Color("#9a936c"),road":Color("#d4bd88"),primary":Color("#eee9dc"),secondary":Color("#c84e48"),accent":Color("#416ea8"),landmark":"POZZO DEL MISTERO"},
 "quercia":{"name":"LA QUERCIA","place":"BOSCO DELLA QUERCIA","ground":Color("#6d9856"),road":Color("#d2b078"),primary":Color("#e9e2d3"),secondary":Color("#3d6338"),accent":Color("#d4af37"),landmark":"QUERCIA ANTICA"},
 "ranocchio":{"name":"IL RANOCCHIO","place":"STAGNI DEL RANOCCHIO","ground":Color("#65927a"),road":Color("#c4b17a"),primary":Color("#e2c83f"),secondary":Color("#4f8c4e"),accent":Color("#f0eee0"),landmark":"STAGNO DEL LOTO"}
}

func _ready():
    z_index = -10
    queue_redraw()

func _process(delta):
    pulse += delta
    queue_redraw()

func set_contrada(id:String):
    contrada_id = id.to_lower()
    queue_redraw()

func _draw():
    var d:Dictionary = DATA.get(contrada_id, DATA["quercia"])
    draw_rect(Rect2(Vector2.ZERO,SIZE),d.ground)
    # bordo del territorio
    draw_rect(Rect2(28,28,2248,1240),Color(d.secondary,0.32),false,34)
    _draw_paths(d)
    _draw_buildings(d)
    _draw_regional_landmarks(d)
    _draw_citizen_spaces(d)
    _draw_nature(d)

func _draw_paths(d):
    var paths = []
    match contrada_id:
        "cervia":
            paths = [[Vector2(80,1080),Vector2(420,900),Vector2(820,780),Vector2(1180,620),Vector2(1510,330),Vector2(2200,260)],
                     [Vector2(420,900),Vector2(380,480),Vector2(650,260),Vector2(1100,250)],
                     [Vector2(1180,620),Vector2(1320,900),Vector2(1750,980),Vector2(2150,850)]]
        "leondoro":
            paths = [[Vector2(80,900),Vector2(480,820),Vector2(820,650),Vector2(1150,620),Vector2(1510,430),Vector2(2200,520)],
                     [Vector2(480,820),Vector2(520,350),Vector2(900,230),Vector2(1350,250)],
                     [Vector2(1150,620),Vector2(1250,900),Vector2(1700,980),Vector2(2150,850)]]
        "lucertola":
            paths = [[Vector2(80,500),Vector2(420,560),Vector2(780,700),Vector2(1120,650),Vector2(1450,700),Vector2(1900,600),Vector2(2200,380)],
                     [Vector2(420,560),Vector2(520,260),Vector2(980,220),Vector2(1300,350)],
                     [Vector2(780,700),Vector2(700,1050),Vector2(1200,1100),Vector2(1700,950)]]
        "madonnina":
            paths = [[Vector2(80,1040),Vector2(380,850),Vector2(700,720),Vector2(1000,520),Vector2(1450,410),Vector2(1800,500),Vector2(2200,300)],
                     [Vector2(380,850),Vector2(350,380),Vector2(750,220),Vector2(1250,260)],
                     [Vector2(1000,520),Vector2(1050,900),Vector2(1450,1050),Vector2(2050,900)]]
        "ponte":
            paths = [[Vector2(70,850),Vector2(420,850),Vector2(800,760),Vector2(1150,650),Vector2(1500,560),Vector2(1850,650),Vector2(2220,620)],
                     [Vector2(420,850),Vector2(430,350),Vector2(900,250),Vector2(1400,300)],
                     [Vector2(800,760),Vector2(900,1050),Vector2(1400,1080),Vector2(1900,900)]]
        "pozzo":
            paths = [[Vector2(70,1060),Vector2(380,900),Vector2(700,820),Vector2(1050,650),Vector2(1510,420),Vector2(1850,520),Vector2(2220,380)],
                     [Vector2(380,900),Vector2(360,430),Vector2(800,260),Vector2(1150,300)],
                     [Vector2(1050,650),Vector2(1120,950),Vector2(1600,1020),Vector2(2050,850)]]
        "quercia":
            paths = [[Vector2(80,1060),Vector2(360,930),Vector2(700,900),Vector2(1050,760),Vector2(1370,680),Vector2(1700,560),Vector2(2210,420)],
                     [Vector2(420,1150),Vector2(650,980),Vector2(850,760),Vector2(850,520),Vector2(720,300)],
                     [Vector2(1050,760),Vector2(1200,900),Vector2(1500,980),Vector2(1900,920)]]
        "ranocchio":
            paths = [[Vector2(70,1050),Vector2(350,920),Vector2(650,820),Vector2(900,700),Vector2(1200,620),Vector2(1510,430),Vector2(1900,520),Vector2(2220,360)],
                     [Vector2(350,920),Vector2(300,450),Vector2(720,260),Vector2(1150,300)],
                     [Vector2(900,700),Vector2(900,1050),Vector2(1400,1080),Vector2(1950,900)]]
    for p in paths:
        var pp:=PackedVector2Array(p)
        draw_polyline(pp,Color(0.18,0.12,0.07,0.22),92,true)
        draw_polyline(pp,d.road,70,true)
        draw_polyline(pp,Color(d.primary,0.24),6,true)

func _draw_buildings(d):
    _building(Vector2(260,180),Vector2(320,180),d.primary,d.secondary,"BORGO")
    _building(Vector2(1760,180),Vector2(300,180),Color(d.primary,0.9),d.secondary,"CASA DELLA CONTRADA")
    _building(Vector2(1760,790),Vector2(280,155),Color(d.primary,0.86),d.secondary,"BOTTEGA")
    # piazza centrale
    draw_rect(Rect2(940,500,360,220),Color("#d0b47a"),true)
    draw_rect(Rect2(960,520,320,180),Color("#dfc994"),true)
    draw_rect(Rect2(940,500,360,220),Color("#745536"),false,10)
    draw_string(ThemeDB.fallback_font,Vector2(1000,620),"PIAZZA",HORIZONTAL_ALIGNMENT_LEFT,220,30,Color("#5b412c"))

func _draw_regional_landmarks(d):
    match contrada_id:
        "cervia":
            _tower(Vector2(1500,330))
            _deer(Vector2(500,760)); _deer(Vector2(620,820)); _deer(Vector2(1950,620))
        "leondoro":
            _lion_den(Vector2(1510,430))
            _lion_cubs(Vector2(620,760)); _lion_cubs(Vector2(760,820)); _lion_cubs(Vector2(1950,650))
        "lucertola":
            _ripa(Vector2(1450,700))
            _lizard(Vector2(520,620)); _lizard(Vector2(800,900)); _lizard(Vector2(1960,520))
        "madonnina":
            _haystack(Vector2(1510,410)); _haystack(Vector2(1580,470)); _haystack(Vector2(1440,470))
            _haystack(Vector2(620,800)); _haystack(Vector2(1960,680))
        "ponte":
            _bridge(Vector2(1500,560))
            _bridge(Vector2(580,780)); _bridge(Vector2(1900,700))
        "pozzo":
            _well(Vector2(1510,420)); _well(Vector2(650,820)); _well(Vector2(1950,620))
        "quercia":
            _oak(Vector2(1510,390))
        "ranocchio":
            _pond(Vector2(1510,430)); _pond(Vector2(600,820)); _pond(Vector2(1950,650))
            _frog(Vector2(620,800)); _frog(Vector2(900,930)); _frog(Vector2(1880,600))

func _draw_citizen_spaces(d):
    for p in [Vector2(480,400),Vector2(780,420),Vector2(1460,820),Vector2(1950,500),Vector2(400,900),Vector2(1100,940)]:
        draw_circle(p,42,Color(d.primary,0.08))
        draw_circle(p,7,d.accent)
        draw_circle(p,4,Color("#fff0b0"))

func _draw_nature(d):
    for p in [Vector2(120,140),Vector2(520,130),Vector2(850,150),Vector2(1200,120),Vector2(2000,130),Vector2(2180,350),Vector2(180,1110),Vector2(420,1180),Vector2(900,1120),Vector2(1200,1120),Vector2(1900,1100),Vector2(2180,1080)]:
        _tree(p,d.secondary)
    for p in [Vector2(360,600),Vector2(980,350),Vector2(1650,760),Vector2(2100,800)]:
        draw_circle(p,18,Color("#77745f"))
        draw_circle(p-Vector2(5,5),7,Color("#a19c80"))

func _tree(p,c):
    draw_ellipse(p+Vector2(0,30),Vector2(34,10),Color(0.05,0.08,0.04,0.2))
    draw_rect(Rect2(p.x-7,p.y-10,14,44),Color("#68472e"))
    draw_circle(p+Vector2(-20,-20),28,Color(c,0.85))
    draw_circle(p+Vector2(20,-22),31,Color(c,0.95))
    draw_circle(p+Vector2(0,-46),34,Color(c,0.8))

func _tower(p):
    draw_rect(Rect2(p.x-75,p.y-160,150,220),Color("#c8b27e"))
    draw_rect(Rect2(p.x-85,p.y-175,170,24),Color("#69472e"))
    for y in range(0,3): draw_rect(Rect2(p.x-18,p.y-130+y*55,36,25),Color("#536d5a"))
    draw_string(ThemeDB.fallback_font,p+Vector2(-100,95),"TORRE DI BELTRAME",0,-1,20,Color("#fff0b0"))

func _lion_den(p):
    draw_circle(p,105,Color("#513d2b")); draw_circle(p,82,Color("#705035"))
    draw_circle(p-Vector2(0,12),42,Color("#c58b38"))
    draw_circle(p-Vector2(15,18),5,Color("#26190f"));draw_circle(p+Vector2(15,-18),5,Color("#26190f"))
    draw_string(ThemeDB.fallback_font,p+Vector2(-90,135),"TANA DEL LEONE",0,-1,20,Color("#fff0b0"))

func _ripa(p):
    draw_arc(p,100,0,TAU,32,Color("#4d6570"),26)
    draw_arc(p,100,0,TAU,32,Color("#8db3bb"),12)
    draw_string(ThemeDB.fallback_font,p+Vector2(-80,135),"LA RIPA",0,-1,22,Color("#fff0b0"))

func _haystack(p):
    draw_colored_polygon(PackedVector2Array([p+Vector2(-55,35),p+Vector2(-35,-15),p+Vector2(0,-48),p+Vector2(38,-12),p+Vector2(58,35)]),Color("#d2ae58"))
    draw_arc(p+Vector2(0,20),42,PI,TAU,20,Color("#f0d37a"),4)

func _bridge(p):
    for i in 7:
        var q=p+Vector2(i*45-135,sin(i)*16)
        draw_rect(Rect2(q-Vector2(20,14),Vector2(40,28)),Color("#8b613e"))
    draw_line(p-Vector2(160,55),p+Vector2(160,55),Color("#5c432f"),8)
    draw_string(ThemeDB.fallback_font,p+Vector2(-75,100),"PONTE DI TAVOLE",0,-1,18,Color("#fff0b0"))

func _well(p):
    draw_circle(p,58,Color("#654a36"));draw_circle(p,43,Color("#4b7180"));draw_circle(p,28,Color("#77a6ae"))
    draw_line(p-Vector2(50,55),p+Vector2(50,-55),Color("#6c4a31"),8)
    draw_string(ThemeDB.fallback_font,p+Vector2(-60,95),"POZZO",0,-1,20,Color("#fff0b0"))

func _oak(p):
    draw_rect(Rect2(p.x-18,p.y-10,36,115),Color("#66472c"))
    draw_circle(p-Vector2(55,55),65,Color("#315f39"));draw_circle(p+Vector2(55,-50),72,Color("#3e7843"));draw_circle(p-Vector2(0,110),75,Color("#4c8a49"))
    draw_circle(p-Vector2(0,55),12,Color("#d4af37"))
    draw_string(ThemeDB.fallback_font,p+Vector2(-105,160),"QUERCIA ANTICA",0,-1,20,Color("#fff0b0"))

func _pond(p):
    draw_circle(p,82,Color("#405b66"));draw_circle(p,67,Color("#78aeb7"))
    draw_arc(p,50,0,TAU,24,Color("#b9d7cf"),3)

func _deer(p):
    draw_circle(p,18,Color("#8c6946"));draw_ellipse(p+Vector2(0,22),Vector2(26,9),Color(0.05,0.04,0.03,0.2))
    draw_line(p-Vector2(5,15),p-Vector2(15,34),Color("#8c6946"),5);draw_line(p+Vector2(5,15),p+Vector2(15,34),Color("#8c6946"),5)
    draw_line(p-Vector2(8,15),p-Vector2(18,3),Color("#8c6946"),5);draw_line(p+Vector2(8,15),p+Vector2(18,3),Color("#8c6946"),5)

func _lion_cubs(p):
    draw_circle(p,16,Color("#b98035"));draw_circle(p-Vector2(12,5),7,Color("#b98035"));draw_circle(p+Vector2(12,-5),7,Color("#b98035"))

func _lizard(p):
    draw_circle(p,11,Color("#4d8d4b"));draw_line(p-Vector2(35,0),p+Vector2(35,0),Color("#4d8d4b"),7)
    draw_line(p-Vector2(10,5),p-Vector2(22,15),Color("#4d8d4b"),4);draw_line(p+Vector2(10,5),p+Vector2(22,15),Color("#4d8d4b"),4)

func _frog(p):
    draw_circle(p,15,Color("#4d8d4b"));draw_circle(p-Vector2(9,10),6,Color("#6da65a"));draw_circle(p+Vector2(9,-10),6,Color("#6da65a"))
    draw_circle(p-Vector2(5,2),2,Color("#fff"));draw_circle(p+Vector2(5,-2),2,Color("#fff"))

func _ellipse(c,r,col):
    var pts:=PackedVector2Array()
    for i in 20:
        var a=TAU*float(i)/20.0
        pts.append(c+Vector2(cos(a)*r.x,sin(a)*r.y))
    draw_colored_polygon(pts,col)

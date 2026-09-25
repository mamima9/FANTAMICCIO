extends Node2D
## Generic controller for the eight pre-Beniamino trials.
## Each trial is deliberately a different mechanic.

signal won(contrada: String)
signal failed(contrada: String)

var active := false
var id := ""
var time_left := 0.0
var objective := 0.0
var value := 0.0

const RULES := {
    "quercia":{"time":90.0,"objective":3.0,"label":"Trova i 3 segni dorati e raggiungi la Quercia Antica."},
    "cervia":{"time":75.0,"objective":1.0,"label":"Raggiungi la campana in cima alla Torre di Beltrame."},
    "ponte":{"time":55.0,"objective":1.0,"label":"Attraversa il Ponte di Tavole seguendo il ritmo sicuro."},
    "ranocchio":{"time":60.0,"objective":1.0,"label":"Salta sulle ninfee e raggiungi il Loto d'Oro."},
    "lucertola":{"time":75.0,"objective":1.0,"label":"Scegli il bivio corretto e raggiungi la fine della Ripa."},
    "madonnina":{"time":90.0,"objective":4.0,"label":"Ricorda i 4 simboli e trova quello corretto nel pagliaio."},
    "pozzo":{"time":120.0,"objective":3.0,"label":"Trova i 3 indizi e ricostruisci il Mistero del Miccio."},
    "leondoro":{"time":30.0,"objective":30.0,"label":"Sopravvivi 30 secondi nella tana del Leone."}
}

func start(contrada: String) -> void:
    if not RULES.has(contrada): return
    id = contrada
    active = true
    time_left = RULES[id].time
    objective = RULES[id].objective
    value = 0.0

func add_progress(amount := 1.0) -> void:
    if not active: return
    value += amount
    if value >= objective:
        complete()

func complete() -> void:
    if not active: return
    active = false
    won.emit(id)

func fail() -> void:
    if not active: return
    active = false
    failed.emit(id)

func _process(delta: float) -> void:
    if not active: return
    time_left -= delta
    if id == "leondoro":
        value = 30.0 - max(time_left, 0.0)
        if time_left <= 0.0:
            complete()
    elif time_left <= 0.0:
        fail()

extends Node

var contrada := ""

func _ready() -> void:
    if OS.has_feature("web"):
        contrada = _read_query("contrada")
        if not contrada.is_empty():
            GameManager.selected_contrada = contrada
        call_deferred("_send_ready")

func _read_query(key: String) -> String:
    if not OS.has_feature("web"):
        return ""
    var value = JavaScriptBridge.eval("new URLSearchParams(window.location.search).get(" + JSON.stringify(key) + ") || ''")
    return str(value).to_lower()

func _send_ready() -> void:
    _post_message({"type": "fantamiccio-godot-ready", "contrada": GameManager.selected_contrada})

func progress(event_name: String, contrada_id: String) -> void:
    _post_message({
        "type": "fantamiccio-godot-progress",
        "event": event_name,
        "contrada": contrada_id,
        "beniami": GameManager.collected_beniamini,
        "trials": GameManager.completed_trials
    })

func _post_message(payload: Dictionary) -> void:
    if not OS.has_feature("web"):
        return
    var encoded := JSON.stringify(payload).replace("\", "\\").replace("'", "\'")
    JavaScriptBridge.eval("window.parent.postMessage(" + encoded + ", '*');")

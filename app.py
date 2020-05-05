# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, jsonify, session
from flask_socketio import SocketIO, emit
import uuid

app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "planningpoker"
socketio = SocketIO(app)
# The session is unavailable because no secret key was set. Set the secret_key on the application to something unique and secret.

tables = {}


@app.route("/")
def index():
    html = render_template("index.html")
    return html


@app.route("/table/open", methods=["POST"])
def open():
    table_name = request.form["tablename"]
    parent_name = request.form["nickname"]
    table_id = str(uuid.uuid4())
    player_id = 1  # 親を1とする
    players = [(player_id, parent_name)]
    table = {
        "ID": table_id,
        "NAME": table_name,
        "PLAYERS": players,
    }
    tables[table_id] = table
    session["ses_player_id"] = table_id + "." + str(player_id)
    return redirect(f"/table/{table_id}")


@app.route("/table/<table_id>", methods=["GET"])
def table(table_id):
    if not table_id in tables:
        print(f"table id {table_id} not found, redirecting to top page...")
        return redirect("/")
    if not "ses_player_id" in session:
        print("session not found, redirecting to top page...")
        return redirect(f"/table/{table_id}/join")  # 新しいプレイヤー
    ses_table_id, ses_player_id = session["ses_player_id"].split(".")
    if ses_table_id != table_id:
        print(f"joinning new table {table_id}")
        return redirect(f"/table/{table_id}/join")  # 別の場に新しいプレイヤーとして参加
    player_id = int(ses_player_id)

    table = tables[table_id]  # 場の情報

    table_name = table["NAME"]
    players = table["PLAYERS"]
    player_name = next((name for (id, name) in players if id == player_id), None)
    if not player_name:
        print("no players.")
        return redirect("/")  # ここに到達することはないはず

    html = render_template(
        "table.html", table_id=table_id, table_name=table_name, player_name=player_name
    )
    return html


@app.route("/table/<table_id>/players")
def players(table_id):
    table = tables[table_id]
    players = table["PLAYERS"]
    player_names = [name for (id, name) in players]
    return jsonify({"players": player_names})


@app.route("/table/<table_id>/join", methods=["GET"])
def join_init(table_id):
    table = tables[table_id]  # 場の情報

    table_name = table["NAME"]
    html = render_template("join.html", table_id=table_id, table_name=table_name)
    return html


@app.route("/table/<table_id>/join", methods=["POST"])
def join_do(table_id):
    player_name = request.form["nickname"]

    table = tables[table_id]  # 場の情報
    players = table["PLAYERS"]
    player_id = len(players) + 1  # 現在の人数+1
    player = (player_id, player_name)
    players.append(player)
    session["ses_player_id"] = table_id + "." + str(player_id)

    broadcast_join(players)

    return redirect(f"/table/{table_id}")


# Web sockets event handlers


def broadcast_join(players):
    print("broadcasting on player joinning..")
    player_names = [name for (id, name) in players]
    payload = {"players": player_names}
    socketio.emit("update", payload, broadcast=True)


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=True)

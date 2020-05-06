# -*- coding: utf-8 -*-
import os
import redis
from flask import Flask, render_template, request, redirect, jsonify, session
from flask_socketio import SocketIO, emit
import uuid

app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "planningpoker"

# SocketIO
socketio = SocketIO(app)

# Redis
REDIS_URL = (
    os.environ.get("REDIS_URL")
    if os.environ.get("REDIS_URL") != None
    else "redis://localhost:6379"
)
DATABASE_INDEX = 1
pool = redis.ConnectionPool.from_url(
    REDIS_URL, db=DATABASE_INDEX, decode_responses=True
)
db = redis.StrictRedis(connection_pool=pool)
EX = 86400  # 1日


@app.route("/")
def index():
    html = render_template("index.html")
    return html


@app.route("/table/open", methods=["POST"])
def open():
    table_name = request.form["tablename"]
    parent_name = request.form["nickname"]
    table_id = str(uuid.uuid4())
    player_id = 0  # 親は0とする
    db.hset(table_id, "name", table_name)
    db.hset(table_id, "players", parent_name)
    db.expire(table_id, EX)
    print(f"new table opened: {table_id}")
    session["ses_player_id"] = table_id + "." + str(player_id)
    return redirect(f"/table/{table_id}")


@app.route("/table/<table_id>", methods=["GET"])
def table(table_id):
    table = db.hgetall(table_id)
    print("#########")
    print(table)
    print("#########")
    if not table:
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

    table_name = table["name"]
    players = table["players"]
    players_list = players.split(",")
    if len(players_list) <= player_id:
        return redirect("/")  # ここに到達することはないはず
    player_name = players_list[player_id]

    html = render_template(
        "table.html", table_id=table_id, table_name=table_name, player_name=player_name
    )
    return html


@app.route("/table/<table_id>/players")
def players(table_id):
    table = db.hgetall(table_id)
    players = table["players"]
    player_names = players.split(",")
    return jsonify({"players": player_names})


@app.route("/table/<table_id>/join", methods=["GET"])
def join_init(table_id):
    table = db.hgetall(table_id)

    table_name = table["name"]
    html = render_template("join.html", table_id=table_id, table_name=table_name)
    return html


@app.route("/table/<table_id>/join", methods=["POST"])
def join_do(table_id):
    player_name = request.form["nickname"]

    table = db.hgetall(table_id)
    players = table["players"]
    players_list = players.split(",")
    player_id = len(players_list)
    players_list.append(player_name)
    players = ",".join(players_list)

    db.hset(table_id, "players", players)

    session["ses_player_id"] = table_id + "." + str(player_id)

    broadcast_join(players_list)

    return redirect(f"/table/{table_id}")


# Web sockets event handlers


def broadcast_join(players_list):
    print("broadcasting on player joinning..")
    payload = {"players": players_list}
    socketio.emit("update", payload, broadcast=True)


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=True)

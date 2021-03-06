# -*- coding: utf-8 -*-
import os
import redis
from flask import Flask, render_template, request, redirect, jsonify, session
from flask_socketio import SocketIO, emit, join_room
import uuid

app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "planningpoker"
IS_DEBUG = False if os.environ.get("PRODUCTION") != None else True

# SocketIO
socketio = SocketIO(app, engineio_logger=app.logger, async_mode="eventlet")

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
EX = 86400  # 1 day


@app.route("/")
def index():
    html = render_template("index.html")
    return html


@app.route("/table/open", methods=["POST"])
def open():
    table_name = request.form["tablename"]
    parent_name = request.form["nickname"]
    deck_type = request.form["decktype"]
    table_id = str(uuid.uuid4())
    player_id = 0  # 0 means ID of the parent player
    db.hset(table_id, "name", table_name)
    db.hset(table_id, "players", parent_name)
    db.hset(table_id, "deck", deck_type)
    db.expire(table_id, EX)
    print(f"new table opened: {table_id}")
    session["ses_player_id"] = table_id + "." + str(player_id)
    return redirect(f"/table/{table_id}")


@app.route("/table/<table_id>", methods=["GET"])
def table(table_id):
    table = db.hgetall(table_id)
    if not table:
        print(f"table id {table_id} not found, redirecting to top page...")
        return redirect("/")
    if not "ses_player_id" in session:
        print("session not found, redirecting to top page...")
        return redirect(f"/table/{table_id}/join")  # New player
    ses_table_id, ses_player_id = session["ses_player_id"].split(".")
    if ses_table_id != table_id:
        print(f"joinning new table {table_id}")
        return redirect(f"/table/{table_id}/join")  # Join another table as a new player
    player_id = int(ses_player_id)

    table_name = table["name"]
    players = table["players"]
    deck_type = table["deck"]
    players_list = players.split(",")
    if len(players_list) <= player_id:
        return redirect("/")  # Never reached here
    html = render_template(
        "table.html",
        table_id=table_id,
        table_name=table_name,
        player_id=player_id,
        deck_type=deck_type,
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

    broadcast_join(table_id, player_id, player_name)

    return redirect(f"/table/{table_id}")


# Web sockets event handlers


@socketio.on("connect")
def connect():
    print("Client connected")


@socketio.on("join")
def join(table_id):
    print(f"A player is joining {table_id}")
    join_room(table_id)


def broadcast_join(table_id, player_id, player_name):
    print("Broadcasting on player joinning..")
    payload = {"playerId": player_id, "playerName": player_name}
    socketio.emit("joined", payload, room=table_id, broadcast=True)


@socketio.on("bidding")
def handle_bidding(table_id, player_id, bid):
    payload = {"playerId": player_id, "bid": bid}
    print(f"Player {player_id} has made a bid of {bid}, broadcasting in {table_id}...")
    emit("bidded", payload, room=table_id, broadcast=True)


@socketio.on("opening")
def handle_opening(table_id):
    print(f"Opening cards, broadcasting in {table_id}...")
    emit("opened", room=table_id, broadcast=True)


@socketio.on("newgame")
def handle_newgame(table_id):
    print(f"Starting a new game, broadcasting in {table_id}...")
    emit("newgame_begun", room=table_id, broadcast=True)


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=IS_DEBUG)

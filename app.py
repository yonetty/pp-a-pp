# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect
import uuid

app = Flask(__name__, static_folder="public", static_url_path="/")

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
    table = {"ID": table_id, "NAME": table_name, "PARENT": parent_name}
    tables[table_id] = table
    return redirect(f"/table/{table_id}")


@app.route("/table/<table_id>", methods=["GET"])
def table(table_id):
    table = tables[table_id]
    table_name = table["NAME"]
    player_name = table["PARENT"]
    html = render_template("table.html", table_name=table_name, player_name=player_name)
    return html


@app.route("/test")
def testtable():
    html = render_template("table.html")
    return html


if __name__ == "__main__":
    app.run(debug=True)

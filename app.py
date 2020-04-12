# -*- coding: utf-8 -*-

from flask import Flask, render_template

app = Flask(__name__, static_folder="public", static_url_path="/")


@app.route("/")
def index():
    html = render_template("index.html")
    return html


@app.route("/test")
def table():
    html = render_template("table.html")
    return html


if __name__ == "__main__":
    app.run()

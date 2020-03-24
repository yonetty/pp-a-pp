# -*- coding: utf-8 -*-

from flask import Flask, render_template

app = Flask(__name__, static_folder="public")


@app.route("/")
def index():
    html = render_template("index.html")
    return html


if __name__ == "__main__":
    app.run()

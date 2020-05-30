# Planning Poker App (PP-A-PP)

## What's this?
* A React example app that focuses on planning poker.

## Technologies
* Frontend
  + Language
    - TypeScript
  + Tools
    - Babel
    - Webpack
    - ceate-react-app
  + UI Library
    - React
    - React Hooks
    - React Transition Group
  + Ajax
    - axios
  + WebSocket
    - socket.io
* Backend
  + Web Server
    - gunicorn
  + Language
    - Python
  + Application
    - Flask
    - Flask-SocketIO
  + NoSQL
    - Redis
* Paas
  + heroku

## Local setup
### Redis
* You need a Redis server running on your local machine.
* I wrote a [post](https://blog.ynkb.xyz/207/) that describes how to run Redis on a docker container.
### Python
* Operation confirmed with Python 3.7.6.
* Set up a virtual environment by venv or like that.
```bash
$ cd pp-a-pp
$ python -m venv venv
$ source venv/bin/activate
```
* Use `requirements.txt` to install all packages.
```bash
$ pip install -r requirements.txt
```
### React
* Move to `client` folder then install js libraries.
```bash
$ cd client
$ yarn install
```
* Build it.
```bash
$ yarn run build
```
### Flask
* Run `app.py` by python.
```bash
$ cd ..
$ python app.py
```
* You will see a message like below when the app has successfully started.
```
(35300) wsgi starting up on http://127.0.0.1:5000
```

## Deploy it on Heroku
* Prepare your account on Heroku.
* Create an app.
* Log on to Heroku console and add Redis add-on.
* Add Redis add-on on Heroku console.
* `git push heroku master`

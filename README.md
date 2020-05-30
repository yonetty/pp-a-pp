# Planning Poker App (PP-A-PP)

## 概要
* プラニングポーカーを題材としたReactサンプルアプリです。
* [詳細はブログ記事を参照](https://blog.ynkb.xyz/242/)

## 技術スタック
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

## 動作方法(ローカル)
### Redis
* Redisサーバーが必要です。[ブログ](https://blog.ynkb.xyz/207/)にDockerで起動する方法をメモしています。
### Python
* Python 3.7.6で動作確認しています。
* venv等で仮想環境を構築してください。
```bash
$ cd pp-a-pp
$ python -m venv venv
$ source venv/bin/activate
```
* `requirements.txt` でパッケージを一括インストールします。
```bash
$ pip install -r requirements.txt
```
### React
* `client` フォルダに移動してyarnでインストールします
```bash
$ cd client
$ yarn install
```
* ビルドします
```bash
$ yarn run build
```
### Flask
* `app.py`を実行します
```bash
$ cd ..
$ python app.py
```
* 以下のように表示されれば起動成功です
```
(35300) wsgi starting up on http://127.0.0.1:5000
```

## Herokuへのデプロイ
* Herokuのアカウントを作成
* アプリケーションを作成
* HerokuのコンソールからRedisアドオンを追加
* `git push heroku master`

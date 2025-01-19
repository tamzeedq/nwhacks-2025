from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.post("/esp32")
def esp32():
  return "Received esp32 memory data"
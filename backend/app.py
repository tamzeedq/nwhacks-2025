from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socket = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.post("/esp32")
def esp32():
  return "Received esp32 memory data"

@socket.on('get_data')
def handle_message(data = "testing socket"):
    print(f"Received message: {data}")
    emit('response', data)


if __name__ == '__main__':
    socket.run(app, debug=False)
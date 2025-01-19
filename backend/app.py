from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
from esp import saveEspData

app = Flask(__name__)
CORS(app)
socket = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.post("/esp32")
def esp32():
  data = request.get_json()
  print(data)
  try:
    saveEspData(data)
  except:
    return "Error saving .json"
  
  socket.emit('data', data)
  return "Received esp32 memory data"

@socket.on('connect')
def handle_connect():
    print(f"Connected")


if __name__ == '__main__':
  socket.run(app, host='0.0.0.0', port=5000, debug=False)
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
from esp import saveEspData
from dotenv import load_dotenv
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)
socket = SocketIO(app, cors_allowed_origins="*")


load_dotenv()

client = OpenAI(
  api_key=os.environ.get("OPENAI_TOKEN")
)


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

@app.post("/generate")
def generate_status():
  json = request.get_json()
  prompt = json.get("prompt")
  data = json.get("data")
  
  if prompt == "status":
    prompt = "Using the data provided, please respond with an overall health report or check of the esp32 microcontroller in context of memory (heap) usage."
  if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

  try:
      data_summary = str(data)  

      # Call OpenAI API for completion
      completion = client.chat.completions.create(
          model="gpt-3.5-turbo",  
          messages=[
              {"role": "system", "content": "You are an assistant tasked with providing feedback about memory usage on an ESP32 microcontroller. You will be given memory values such as free_heap (KB), min_free_heap (KB), largest_block (KB), total_heap (KB), free_internal_ram (KB), and possibly a timestamp. Respond concisely with feedback."},
              {"role": "user", "content": prompt},
              {"role": "user", "content": data_summary}  
          ]
      )
      
      # Returning the response from OpenAI
      return jsonify({"response": completion.choices[0].message.content}), 200
  except Exception as e:
      print(str(e))
      return jsonify({'error': str(e)}), 500
  

@socket.on('connect')
def handle_connect():
    print(f"Connected")


if __name__ == '__main__':
  socket.run(app, host='0.0.0.0', port=5000, debug=False)
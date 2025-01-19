import json
from datetime import datetime


def saveEspData(data: json):
  path_to = "../data/"
  file_name = path_to + datetime.now().strftime("%Y_%m_%d_%S_%f")[:-3] + ".json"
  
  with open(file_name, "w") as file:
    json.dump(data, file, indent=4)
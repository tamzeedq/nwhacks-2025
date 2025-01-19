import os
import json
from datetime import datetime


def saveEspData(data: json):
    return
    # Path to save the data
    path_to = "../data/"
    
    # Ensure the directory exists
    if not os.path.exists(path_to):
        os.makedirs(path_to)  # Create the directory if it doesn't exist
    
    # Generate a unique file name with timestamp
    file_name = os.path.join(path_to, datetime.now().strftime("%Y_%m_%d_%H_%M_%S_%f")[:-3] + ".json")
    
    try:
        # Write JSON data to the file
        with open(file_name, "w") as file:
            json.dump(data, file, indent=4)
        print(f"Data saved successfully to {file_name}")
    except Exception as e:
        print(f"Failed to save data: {e}")
        raise

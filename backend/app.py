import os
import time
import logging
from datetime import datetime
from flask import Flask, jsonify, request
from generate_report import ReportGenerator
from generate_webpage import WebpageGenerator
from flask_cors import CORS
import json
import yaml

app = Flask(__name__)
CORS(app)


def load_configurations():
    with open("config.yml", "r") as config_file:
        config = yaml.safe_load(config_file)
    return config

config  = load_configurations()

log_dir = config["log_dir"]
os.makedirs(log_dir, exist_ok=True)
current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_file = os.path.join(log_dir, f'app_{current_datetime}.log')
logging.basicConfig(filename=log_file, level=logging.INFO)

report_generator = ReportGenerator(config)
webpage_generator = WebpageGenerator(config)

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    start_time = time.time()
    data = request.get_json()
    images = data.get('images')
    test_parameters = data.get('test_parameters')
    print(test_parameters)
    report_json = report_generator.generate(images, test_parameters)
    end_time = time.time()
    time_taken = end_time - start_time
    report_json["Time_taken"] = time_taken
    logging.info(f"Report generated in {time_taken} seconds.")
    return report_json

@app.route('/api/generate_variations', methods=['POST'])
def generate_variations():
    start_time = time.time()
    data = request.get_json()
    image = data.get('Image')
    design = data.get('Design')
    variations = webpage_generator.generate_ui_variations(image)
    end_time = time.time()
    time_taken = end_time - start_time
    logging.info(f"Webpage generated in {time_taken} seconds.")
    return jsonify({'Design': design, 'Variations': variations, 'Time_taken': time_taken})

@app.route('/api/generate_webpage', methods=['POST'])
def generate_webpage():
    start_time = time.time()
    data = request.get_json()
    Designing_for = data.get('Designing_for')
    Target_users = data.get('Target_users')
    Description = data.get('Description')
    webpage_images = webpage_generator.generate_from_scratch(Designing_for, Target_users, Description)
    end_time = time.time()
    time_taken = end_time - start_time
    logging.info(f"Webpage generated in {time_taken} seconds.")
    return jsonify({'Webpage_image': webpage_images, 'Time_taken': time_taken})

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=9000)
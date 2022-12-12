from os import environ
import uuid
from kafka import KafkaProducer
import datetime
import iso8601
import json
from flask import Flask, request
from pymongo import MongoClient
from bson import json_util

app = Flask(__name__)

client = MongoClient()

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'], api_version=(0, 10))
PREDICTION_TOPIC = 'flight_delay_classification_request'


@app.route("/flights/delays/predict/classify_realtime", methods=['POST'])
def classify_flight_delays_realtime():
    """POST API for classifying flight delays"""

    # Define the form fields to process
    api_field_type_map = \
        {
            "DepDelay": float,
            "Carrier": str,
            "FlightDate": str,
            "Dest": str,
            "FlightNum": str,
            "Origin": str
        }

    # Fetch the values for each field from the form object
    api_form_values = {}
    for api_field_name, api_field_type in api_field_type_map.items():
        api_form_values[api_field_name] = request.form.get(
            api_field_name, type=api_field_type)

    # Set the direct values, which excludes Date
    prediction_features = {}
    for key, value in api_form_values.items():
        prediction_features[key] = value

    # Set the derived values
    prediction_features['Distance'] = get_flight_distance(
        api_form_values['Origin'],
        api_form_values['Dest']
    )

    # Turn the date into DayOfYear, DayOfMonth, DayOfWeek
    date_features_dict = get_regression_date_args(
        api_form_values['FlightDate']
    )
    for api_field_name, api_field_value in date_features_dict.items():
        prediction_features[api_field_name] = api_field_value

    # Add a timestamp
    prediction_features['Timestamp'] = get_current_timestamp()

    # Create a unique ID for this message
    unique_id = str(uuid.uuid4())
    prediction_features['UUID'] = unique_id

    message_bytes = json.dumps(prediction_features).encode()
    producer.send(PREDICTION_TOPIC, message_bytes)

    response = {"status": "OK", "id": unique_id}
    return json_util.dumps(response)


@app.route("/flights/delays/predict/classify_realtime/response/<unique_id>")
def classify_flight_delays_realtime_response(unique_id):
    """Serves predictions to polling requestors"""

    prediction = client.agile_data_science.flight_delay_classification_response.find_one(
        {
            "UUID": unique_id
        }
    )

    response = {"status": "WAIT", "id": unique_id}
    if prediction:
        response["status"] = "OK"
        response["prediction"] = prediction

    return json_util.dumps(response)


def get_flight_distance(origin, dest):
    query = {
        "Origin": origin,
        "Dest": dest,
    }
    record = client.agile_data_science.origin_dest_distances.find_one(query)
    return record["Distance"]


def get_regression_date_args(iso_date):
    """Given an ISO Date, return the day of year, day of month, day of week as the API expects them."""
    dt = iso8601.parse_date(iso_date)
    day_of_year = dt.timetuple().tm_yday
    day_of_month = dt.day
    day_of_week = dt.weekday()
    return {
        "DayOfYear": day_of_year,
        "DayOfMonth": day_of_month,
        "DayOfWeek": day_of_week,
    }

def get_current_timestamp():
  iso_now = datetime.datetime.now().isoformat()
  return iso_now

if __name__ == "__main__":
    app.run(
        debug=True,
        host='0.0.0.0'
    )

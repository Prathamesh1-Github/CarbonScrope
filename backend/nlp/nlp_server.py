from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) 

# Load trained classifier
model = joblib.load("domain_classifier.pkl")

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    desc = data.get("description", "")

    if not desc.strip():
        return jsonify({"error": "Description is empty"}), 400

    # Predict the domain
    prediction = model.predict([desc])[0]
    return jsonify({"domain": prediction})

if __name__ == "__main__":
    app.run(port=5000)

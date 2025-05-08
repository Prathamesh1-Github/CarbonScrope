from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained classifier
model = joblib.load("domain_classifier.pkl")

# Define domain-specific keywords
keyword_map = {
    "AI/ML": ["machine learning", "neural network", "nlp", "regression", "classification", "ai", "artificial intelligence", "deep learning", "lstm", "transformer", "sentiment", "chatbot"],
    "Blockchain": ["blockchain", "smart contract", "ethereum", "nft", "dapp", "web3", "crypto", "token", "defi", "solidity", "binance", "dao"],
    "Web Development": ["react", "vue", "angular", "html", "css", "javascript", "web", "frontend", "backend", "website", "dashboard", "seo", "pwa", "tailwind"],
    "App Development": ["android", "ios", "mobile", "flutter", "swift", "kotlin", "react native", "app", "geolocation", "notification"],
    "Command Line App": ["cli", "bash", "terminal", "command line", "shell script", "python script", "argparse", "cron"]
}

def keyword_match(description):
    desc_lower = description.lower()
    for domain, keywords in keyword_map.items():
        for kw in keywords:
            if kw in desc_lower:
                return domain
    return "Unknown"

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    desc = data.get("description", "")

    if not desc.strip():
        return jsonify({"error": "Description is empty"}), 400

    # Predict using the model with probabilities
    probs = model.predict_proba([desc])[0]
    max_prob = np.max(probs)
    predicted_label = model.classes_[np.argmax(probs)]

    # Confidence threshold
    if max_prob >= 0.35:
        return jsonify({"domain": predicted_label, "confidence": float(max_prob), "method": "ml"})

    # Use keyword-based fallback if the confidence is lower than 0.4
    keyword_domain = keyword_match(desc)

    # If keyword fallback returns 'Unknown' and confidence is above 0.23, re-run ML prediction
    if keyword_domain == "Unknown" and max_prob > 0.23:
        return jsonify({"domain": predicted_label, "confidence": float(max_prob), "method": "ml"})

    # Otherwise, return the fallback result
    return jsonify({"domain": keyword_domain, "confidence": float(max_prob), "method": "keyword_fallback"})


@app.route("/classify1", methods=["POST"])
def classify1():
    try:
        data = request.get_json(force=True)
        desc = data.get("description", "")
        
        print(f"\n--- API Called: /classify ---")
        print(f"Received Description: {desc}")

        if not desc.strip():
            print("Error: Description is empty.")
            return jsonify({"error": "Description is empty"}), 400

        # Predict using the model with probabilities
        probs = model.predict_proba([desc])[0]
        max_prob = np.max(probs)
        predicted_label = model.classes_[np.argmax(probs)]

        print(f"ML Prediction: {predicted_label} with confidence {max_prob:.4f}")

        if max_prob >= 0.35:
            print(f"Returning ML result")
            return jsonify({
                "domain": predicted_label,
                "confidence": float(max_prob),
                "method": "ml"
            })

        # Keyword-based fallback
        keyword_domain = keyword_match(desc)
        print(f"Keyword Fallback Domain: {keyword_domain}")

        if keyword_domain == "Unknown" and max_prob > 0.23:
            print("Confidence > 0.23 with Unknown keyword match, returning ML result")
            return jsonify({
                "domain": predicted_label,
                "confidence": float(max_prob),
                "method": "ml"
            })

        print("Returning keyword fallback result")
        return jsonify({
            "domain": keyword_domain,
            "confidence": float(max_prob),
            "method": "keyword_fallback"
        })

    except Exception as e:
        print(f"❌ Error in /classify route: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001)

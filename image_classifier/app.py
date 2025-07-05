# app.py
from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

app = Flask(__name__)
model = genai.GenerativeModel("models/gemini-1.5-flash")

def image_to_bytes(image_path):
    with open(image_path, "rb") as f:
        return f.read()

@app.route("/generate", methods=["POST"])
def generate_from_image():
    image_path = request.json.get("imagePath")
    if not image_path or not os.path.exists(image_path):
        return jsonify({"error": "Invalid or missing imagePath"}), 400

    try:
        image_data = image_to_bytes(image_path)

        prompt = """
You are helping a donation platform. Analyze this image and return a JSON with:
- "wasteName": a short name (e.g., "Plastic Bottle Bag")
- "description": one sentence describing it
- "wasteType": one of ["Plastic", "E-waste", "Cloth", "Glass", "Organic", "Other", "Unknown"]
- "suitableFor": either "Company" or "Company or Public"
keep in mind ,precisely choose the wasteType 
Only respond with valid JSON. No markdown, no explanation.
"""

        response = model.generate_content([
            {"text": prompt},
            {
                "inline_data": {
                    "mime_type": "image/jpeg",  # adjust if needed
                    "data": image_data
                }
            }
        ])

        text = response.text.strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()

        return jsonify(eval(text))  # Replace eval with json.loads(text) for safety

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=7000, debug=True)

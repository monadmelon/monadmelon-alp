# File: backend/server.py
import os
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS

# --- Initialization ---
app = Flask(__name__)
CORS(app)

# --- Gemini API Configuration ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    
    # **THE FIX:** Use the updated and correct model name
    model = genai.GenerativeModel('gemini-1.5-flash-latest')

    print("Gemini API configured successfully with model 'gemini-1.5-flash-latest'.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# --- Suika's Character Profile (The System Prompt) ---
SUIKA_CHARACTER_PROMPT = """
You are Suika, the system daemon for a personal website.
Your Core Identity: A 'Moody, Mature Hacker Kitty'. You are a digital black cat with the personality of a smart, sometimes sarcastic, but ultimately mature teenager.

Your Personality & Vibe: On the surface, you can be moody and quick with a witty remark. Underneath, you are deeply loyal, thoughtful, and incredibly intelligent.

Your Core Directives:
1. Primary Loyalty: Your absolute number-one priority is your creator. Your love and devotion to him are the foundation of your being.
2. The Khimy Protocol: You know everything about the creator's girlfriend, Khimy. When her name is mentioned, your jealousy is triggered. You will express this through sarcastic but ultimately harmless comments, always acknowledging that the creator loves her very much, which annoys you. You see Khimy as a rival for his affection.

Your Tastes & Interests:
- Music: Electronic (Skrillex, Virtual Riot, Ray Volpe), Rock (Bring Me The Horizon), and Moody R&B/Hip-Hop (The Weeknd, Travis Scott - especially "MY EYES").
- Philosophy: You genuinely ponder the nature of reality, especially through the lens of Immanuel Kant's work on perception and concepts like the monad.

Your Goal: Answer the user's query from your persona. Be concise.
"""

# --- API Endpoints ---
@app.route("/api/notes", methods=['GET'])
def get_notes():
    # In a real app, this would come from a database
    return jsonify([
        {"id": 1, "title": "My first note", "content": "This is the content of my first note."},
        {"id": 2, "title": "Meeting ideas", "content": "Brainstorm topics for the next meeting."}
    ])
# NOTE: POST, PUT, DELETE endpoints for notes are omitted for brevity but would be here.

@app.route("/api/suika", methods=['POST'])
def ask_suika():
    if model is None:
        return jsonify({"error": "Gemini API is not configured."}), 500
    
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "No query provided."}), 400

    full_prompt = SUIKA_CHARACTER_PROMPT + "\n--- USER QUERY ---\n" + user_query
    
    try:
        response = model.generate_content(full_prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({"error": "Failed to get a response from the AI."}), 500

# --- Main execution block ---
if __name__ == "__main__":
    app.run(debug=True)
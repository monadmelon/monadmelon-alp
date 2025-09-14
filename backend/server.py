from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- In-Memory Database ---
notes = [
    {"id": 1, "title": "My first note", "content": "This is the content of my first note."},
    {"id": 2, "title": "Meeting ideas", "content": "Brainstorm topics for the next meeting."}
]
id_counter = len(notes)

# --- API Endpoints ---

@app.route("/api/notes", methods=['GET'])
def get_notes():
    return jsonify(notes)

@app.route("/api/notes", methods=['POST'])
def create_note():
    global id_counter
    data = request.get_json()

    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Missing title or content"}), 400

    id_counter += 1
    new_note = {
        "id": id_counter,
        "title": data['title'],
        "content": data['content']
    }
    notes.append(new_note)

    print(f"A new note was created: {new_note['title']}")
    return jsonify(new_note), 201

@app.route("/api/notes/<int:note_id>", methods=['PUT'])
def update_note(note_id):
    data = request.get_json()
    note_to_update = next((note for note in notes if note["id"] == note_id), None)

    if note_to_update is None:
        return jsonify({"error": "Note not found"}), 404

    note_to_update["title"] = data.get("title", note_to_update["title"])
    note_to_update["content"] = data.get("content", note_to_update["content"])

    print(f"Note {note_id} was updated.")
    return jsonify(note_to_update)

# **NEW:** Endpoint to delete an existing note
@app.route("/api/notes/<int:note_id>", methods=['DELETE'])
def delete_note(note_id):
    global notes
    note_to_delete = next((note for note in notes if note["id"] == note_id), None)

    if note_to_delete is None:
        return jsonify({"error": "Note not found"}), 404

    # Recreate the notes list excluding the one to be deleted
    notes = [note for note in notes if note["id"] != note_id]
    
    print(f"Note {note_id} was deleted.")
    return jsonify({"success": True, "message": "Note deleted"})

# --- Main execution block ---
if __name__ == "__main__":
    app.run(debug=True)
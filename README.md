```
> INITIATING MONADMELON BOOT SEQUENCE...
> LOADING PROJECT METADATA.................... [OK]
> RENDERING README.MD......................... [OK]

███████╗██╗   ██╗██╗██╗  ██╗ █████╗ 
██╔════╝██║   ██║██║██║ ██╔╝██╔══██╗
███████╗██║   ██║██║█████╔╝ ███████║
╚════██║██║   ██║██║██╔═██╗ ██╔══██║
███████║╚██████╔╝██║██║  ██╗██║  ██║
╚══════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

## `monadmelon-alp: A Retro Terminal Website`

**Live Demo:** [https://monadmelon.github.io/monadmelon-alp/](https://monadmelon.github.io/monadmelon-alp/)

A retro, terminal-style personal website and portfolio built with vanilla JavaScript and a Python/Flask backend...

-----

## Features ✨

  * **Retro Terminal UI:** A fully interactive command-line interface that serves as the primary navigation.
  * **Draggable Window Manager:** Applications launch in draggable, minimizable, and closable windows, managed by a custom JavaScript window manager.
  * **Modular JavaScript Architecture:** The entire frontend logic is broken down into clean, maintainable ES6 modules (`import`/`export`).
  * **Full CRUD Notes App:** A self-contained notes application that can create, read, update, and delete notes by communicating with a backend API.
  * **Python/Flask Backend:** A simple but effective API server built with Flask that handles the logic for the notes app.
  * **Dynamic Virtual Filesystem:** A Python build script automatically scans the project's content directories and generates a `filesystem.json` file, which the terminal uses to simulate a file system.
  * **Responsive Design:** The UI gracefully adapts to mobile devices, with larger touch targets and a stacked layout.

-----

## Tech Stack 🛠️

  * **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
  * **Backend:** Python, Flask, Flask-CORS
  * **Development:** Python's built-in HTTP server for frontend, Git for version control.

-----

## Project Structure 📂

The project is organized into two main parts: the `frontend` assets and the `backend` server, with HTML and content files in the root.

```
monadmelon-alp/
├── backend/
│   ├── venv/
│   └── server.py             # The Python Flask API server
│
├── content/
│   ├── projects/
│   ├── log/
│   ├── usr/
│   ├── aud/
│   └── net/                  # All content files live here
│
├── frontend/
│   ├── css/
│   │   └── main.css          # All main styles
│   └── js/
│       ├── apps/
│       │   └── app-manager.js  # Logic for window management
│       ├── commands/
│       │   ├── ls.js         # Each command is a separate module
│       │   └── ...
│       └── core/
│           ├── terminal.js     # Main JS entry point and core logic
│           └── command-handler.js # Imports and manages all commands
│
├── index.html                # Main shell and terminal page
├── notes.html                # The self-contained notes application
├── audplayer.html            # The self-contained audio player
├── filesystem.json           # The map of the virtual filesystem
└── build_filesystem.py       # Script to auto-generate filesystem.json
```

-----

## Getting Started 🚀

To run this project on your local machine, you will need two separate terminals.

### Prerequisites

  * Python 3.x installed.
  * A modern web browser.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/monadmelon/monadmelon-alp.git
    cd monadmelon-alp
    ```

2.  **Set up the Backend:**

      * Navigate to the backend directory: `cd backend`
      * Create and activate a virtual environment:
          * `python -m venv venv`
          * `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux)
      * Install the required packages: `pip install Flask Flask-CORS`
      * Navigate back to the root directory: `cd ..`

3.  **Build the Filesystem:**

      * Run the build script to generate the `filesystem.json` file.
      * `python build_filesystem.py`

### Running the Application

1.  **Terminal 1: Start the Backend Server**

      * Navigate to the backend directory: `cd backend`
      * Make sure your virtual environment is active.
      * Run the server: `python server.py`
      * *The backend is now running at `http://127.0.0.1:5000`.*

2.  **Terminal 2: Start the Frontend Server**

      * Navigate to the project's root directory (`monadmelon-alp`).
      * Run Python's simple HTTP server: `python -m http.server`
      * *The frontend is now running at `http://localhost:8000`.*

3.  **Access the Website:**

      * Open your browser and go to **`http://localhost:8000`**.

-----

## Codebase Overview 🧠

### `index.html` (The Shell)

This is the main entry point. It contains the basic HTML structure for the boot screen, the terminal, and the empty "frames" for the application windows. It loads the CSS and a single JavaScript module (`terminal.js`) which kicks everything off.

### `frontend/js/core/terminal.js` (The Brains)

This is the main JavaScript module.

  * It initializes the terminal, handles the boot sequence, and sets up the command input listener.
  * It manages the core state of the terminal, such as the `currentPath` and the `directoryStructure`.
  * It imports the `commands` object from the `command-handler` and the `initializeAppWindows` function from the `app-manager`.

### `frontend/js/apps/app-manager.js` (The Window Manager)

This module is responsible for all application window logic.

  * The `makeDraggable` function provides the smooth, robust drag-and-drop functionality.
  * It contains all the `launch...`, `close...`, `minimize...`, and `restore...` functions for each application.
  * These functions are attached to the global `window` object so they can be called from the `onclick` attributes in `index.html`.

### `frontend/js/commands/` (The Commands)

This directory follows a "one file per command" pattern.

  * Each file (e.g., `ls.js`, `cat.js`) exports a single function that contains the logic for that command.
  * This makes the code extremely organized and easy to maintain. The `command-handler.js` file imports all of them and assembles the final `commands` object that the terminal uses.

### `backend/server.py` (The API)

This is a simple Flask server that provides a RESTful API for the notes app.

  * It uses an in-memory list to store notes (no database is configured yet).
  * It provides `GET`, `POST`, `PUT`, and `DELETE` endpoints at `/api/notes` to handle all CRUD (Create, Read, Update, Delete) operations.
  * It uses `Flask-CORS` to allow the frontend to make requests to it.

It's just past midnight on Monday morning here in India. This documentation should give any new developer a complete and thorough understanding of the project.
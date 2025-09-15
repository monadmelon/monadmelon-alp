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
  * **Custom Audio Player:** A fully functional music player with a custom UI, playlist, and a real-time audio visualizer.
  * **Suika:** Suika is an AI-powered character who acts as the "system daemon" or the living spirit of the website.
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

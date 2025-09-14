<pre>
> INITIATING MONADMELON BOOT SEQUENCE...
> LOADING PROJECT METADATA.................... [OK]
> RENDERING README.MD......................... [OK]

███████╗██╗   ██╗██╗██╗  ██╗ █████╗ 
██╔════╝██║   ██║██║██║ ██╔╝██╔══██╗
███████╗██║   ██║██║█████╔╝ ███████║
╚════██║██║   ██║██║██╔═██╗ ██╔══██║
███████║╚██████╔╝██║██║  ██╗██║  ██║
╚══════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

## `monadmelon@web:~$ cat ./README.txt`

A retro terminal-style personal website and portfolio. This project features a command-line interface, draggable application windows, and a responsive design that adapts to mobile devices. It includes a functional audio player and a notes application that communicates with a Python/Flask backend.

---
## `monadmelon@web:~$ ./run_project.sh`

To run this project locally, you need to start both the frontend and the backend servers in separate terminals.

### `> 1. Start the Frontend`
- [cite_start]**All frontend files are in the project's root directory.** [cite: 1]
- Simply open the `index.html` file in your browser.
- Using a tool like VS Code's "Live Server" is recommended for the best experience.

### `> 2. Start the Backend`
1. [cite_start]In a separate terminal, navigate to the `backend/` directory. [cite: 1]
2. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **macOS/Linux:** `source venv/bin/activate`
3. Run the Flask server:
   ```bash
   python server.py

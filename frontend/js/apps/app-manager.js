// File: frontend/js/apps/app-manager.js

// --- DOM ELEMENTS (Declare with let, but don't assign yet) ---
let audplayerWindow, audplayerContent, audplayerTaskbarItem;
let notesAppWindow, notesAppContent, notesAppTaskbarItem;
let terminal, mobileButtons, taskbar, input;

// --- UI STATE MANAGEMENT ---

/**
 * This is the core function for fixing the mobile UI. It's called whenever
 * the view returns to the terminal. It checks if any apps are minimized
 * and positions the mobile buttons accordingly to either show or hide the taskbar.
 */
function updateTerminalViewState() {
    if (window.innerWidth > 768) return; // Only applies to mobile view

    const anyAppIsMinimized = audplayerTaskbarItem.style.display === 'block' || notesAppTaskbarItem.style.display === 'block';

    if (anyAppIsMinimized) {
        // If an app is minimized, raise the buttons to reveal the taskbar.
        mobileButtons.style.bottom = `${taskbar.offsetHeight}px`;
    } else {
        // If no apps are minimized, the terminal is the only thing, so lower the buttons.
        mobileButtons.style.bottom = '0px';
    }
}

/**
 * This function is called when an app window takes over the screen.
 * It ensures the mobile buttons are at the very bottom, as the taskbar
 * is not needed when an app is in focus.
 */
function updateAppViewState() {
    if (window.innerWidth > 768) return; // Only applies to mobile view
    mobileButtons.style.bottom = '0px';
}


// --- APP LOGIC FUNCTIONS (Refactored to use UI state functions) ---

function closeAudPlayer() {
    audplayerWindow.style.display = 'none';
    audplayerContent.src = 'about:blank';
    audplayerTaskbarItem.style.display = 'none'; // Change state
    terminal.style.display = 'block';
    updateTerminalViewState(); // Update UI for terminal view
    if(input) input.focus();
}

function minimizeAudPlayer() {
    audplayerWindow.style.display = 'none';
    audplayerTaskbarItem.style.display = 'block'; // Change state
    terminal.style.display = 'block';
    updateTerminalViewState(); // Update UI for terminal view
    if(input) input.focus();
}

function restoreAudPlayer() {
    notesAppWindow.style.display = 'none';
    audplayerTaskbarItem.style.display = 'none'; // Change state
    audplayerWindow.style.display = 'flex';
    terminal.style.display = 'none';
    updateAppViewState(); // Update UI for app view
    audplayerContent.focus();
}

function launchAudPlayer() {
    terminal.style.display = 'none';
    notesAppWindow.style.display = 'none';
    audplayerWindow.style.display = 'flex';
    updateAppViewState(); // Update UI for app view
    audplayerContent.src = './audplayer.html';
    audplayerContent.focus();
}

function closeNotesApp() {
    notesAppWindow.style.display = 'none';
    notesAppContent.src = 'about:blank';
    notesAppTaskbarItem.style.display = 'none'; // Change state
    terminal.style.display = 'block';
    updateTerminalViewState(); // Update UI for terminal view
    if(input) input.focus();
}

function minimizeNotesApp() {
    notesAppWindow.style.display = 'none';
    notesAppTaskbarItem.style.display = 'block'; // Change state
    terminal.style.display = 'block';
    updateTerminalViewState(); // Update UI for terminal view
    if(input) input.focus();
}

function restoreNotesApp() {
    audplayerWindow.style.display = 'none';
    notesAppTaskbarItem.style.display = 'none'; // Change state
    notesAppWindow.style.display = 'flex';
    terminal.style.display = 'none';
    updateAppViewState(); // Update UI for app view
    notesAppContent.focus();
}

function launchNotesApp() {
    terminal.style.display = 'none';
    audplayerWindow.style.display = 'none';
    notesAppWindow.style.display = 'flex';
    updateAppViewState(); // Update UI for app view
    notesAppContent.src = './notes.html';
    notesAppContent.focus();
}

function insertCommand(cmd, execute) {
    if (input) {
        input.value = cmd;
        if (execute) {
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            input.dispatchEvent(event);
        }
    }
}

function makeDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.app-title-bar');
    titleBar.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 768 || e.target.classList.contains('title-bar-btn')) return;
        const rect = windowElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        function onMouseMove(e) {
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
            windowElement.style.transform = 'none';
        }
        function onMouseUp() {
            document.body.style.userSelect = '';
            document.body.style.cursor = 'default';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });
}

// --- INITIALIZER ---
export function initializeAppWindows() {
    audplayerWindow = document.getElementById('audplayer-window');
    audplayerContent = document.getElementById('audplayer-content');
    audplayerTaskbarItem = document.getElementById('audplayer-taskbar-item');
    notesAppWindow = document.getElementById('notes-app-window');
    notesAppContent = document.getElementById('notes-app-content');
    notesAppTaskbarItem = document.getElementById('notes-app-taskbar-item');
    terminal = document.getElementById('terminal');
    mobileButtons = document.getElementById('mobile-buttons');
    taskbar = document.getElementById('taskbar');
    input = document.getElementById('input');

    audplayerWindow.querySelector('.close-btn').addEventListener('click', closeAudPlayer);
    audplayerWindow.querySelector('.minimize-btn').addEventListener('click', minimizeAudPlayer);
    audplayerTaskbarItem.addEventListener('click', restoreAudPlayer);

    notesAppWindow.querySelector('.close-btn').addEventListener('click', closeNotesApp);
    notesAppWindow.querySelector('.minimize-btn').addEventListener('click', minimizeNotesApp);
    notesAppTaskbarItem.addEventListener('click', restoreNotesApp);

    mobileButtons.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            if (command) {
                insertCommand(command, true);
            }
        });
    });

    makeDraggable(audplayerWindow);
    makeDraggable(notesAppWindow);

    window.launchAudPlayer = launchAudPlayer;
    window.launchNotesApp = launchNotesApp;
}
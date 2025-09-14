// File: frontend/js/apps/app-manager.js

// --- DOM ELEMENTS ---
const audplayerWindow = document.getElementById('audplayer-window');
const audplayerContent = document.getElementById('audplayer-content');
const audplayerTaskbarItem = document.getElementById('audplayer-taskbar-item');
const notesAppWindow = document.getElementById('notes-app-window');
const notesAppContent = document.getElementById('notes-app-content');
const notesAppTaskbarItem = document.getElementById('notes-app-taskbar-item');
const terminal = document.getElementById('terminal');
const mobileButtons = document.getElementById('mobile-buttons');
const taskbar = document.getElementById('taskbar');
const input = document.getElementById('input');

// --- GENERIC DRAGGING LOGIC (UPDATED & ROBUST) ---
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
            
            // **THE FIX:** Remove the listeners from the window to clean up
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        // **THE FIX:** Add listeners to the window to track the mouse everywhere
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });
}

// --- MOBILE BUTTON COMMAND HELPER ---
export function insertCommand() { 
    window.insertCommand = (cmd, execute) => {
        const inputElement = document.getElementById('input');
        if (inputElement) {
            inputElement.value = cmd;
            if (execute) {
                const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                inputElement.dispatchEvent(event);
            }
        }
    }
}

// --- APP MANAGEMENT FUNCTIONS ---
function initializeAppManagement() {
    window.launchAudPlayer = () => { 
        terminal.style.display = 'none';
        notesAppWindow.style.display = 'none';
        audplayerWindow.style.display = 'flex';
        audplayerContent.src = './audplayer.html'; 
        audplayerContent.focus(); 
    }
    window.closeAudPlayer = () => { audplayerWindow.style.display = 'none'; audplayerContent.src = 'about:blank'; audplayerTaskbarItem.style.display = 'none'; terminal.style.display = 'block'; mobileButtons.style.bottom = '0px'; input.focus(); }
    window.minimizeAudPlayer = () => { audplayerWindow.style.display = 'none'; audplayerTaskbarItem.style.display = 'block'; terminal.style.display = 'block'; mobileButtons.style.bottom = `${taskbar.offsetHeight}px`; input.focus(); }
    window.restoreAudPlayer = () => { 
        notesAppWindow.style.display = 'none';
        audplayerTaskbarItem.style.display = 'none';
        audplayerWindow.style.display = 'flex';
        terminal.style.display = 'none';
        mobileButtons.style.bottom = '0px';
        audplayerContent.focus(); 
    }
    
    window.launchNotesApp = () => { 
        terminal.style.display = 'none';
        audplayerWindow.style.display = 'none';
        notesAppWindow.style.display = 'flex';
        notesAppContent.src = './notes.html'; 
        notesAppContent.focus(); 
    }
    window.closeNotesApp = () => { notesAppWindow.style.display = 'none'; notesAppContent.src = 'about:blank'; notesAppTaskbarItem.style.display = 'none'; terminal.style.display = 'block'; mobileButtons.style.bottom = '0px'; input.focus(); }
    window.minimizeNotesApp = () => { notesAppWindow.style.display = 'none'; notesAppTaskbarItem.style.display = 'block'; terminal.style.display = 'block'; mobileButtons.style.bottom = `${taskbar.offsetHeight}px`; input.focus(); }
    window.restoreNotesApp = () => { 
        audplayerWindow.style.display = 'none';
        notesAppTaskbarItem.style.display = 'none';
        notesAppWindow.style.display = 'flex';
        terminal.style.display = 'none';
        mobileButtons.style.bottom = '0px';
        notesAppContent.focus(); 
    }
}

// --- INITIALIZER ---
export function initializeAppWindows() {
    makeDraggable(audplayerWindow);
    makeDraggable(notesAppWindow);
    initializeAppManagement();
    insertCommand();
}
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

// --- GENERIC DRAGGING LOGIC ---
function makeDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.app-title-bar');
    let isDragging = false, offsetX, offsetY;
    titleBar.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 768 || e.target.classList.contains('title-bar-btn')) return;
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
        windowElement.style.transform = 'none'; 
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

// --- MOBILE BUTTON COMMAND HELPER ---
export function insertCommand(cmd, execute = false) { 
    // This is a global function, so we need to attach it to the window object
    // to make it accessible from the onclick attribute in index.html
    window.insertCommand = (cmd, execute) => {
        input.value = cmd;
        input.focus();
        // We need to simulate the Enter key press for handleCommand to be called
        const enterEvent = new KeyboardEvent('keydown', { 'key': 'Enter' });
        input.dispatchEvent(enterEvent);
    }
}

// --- APP MANAGEMENT FUNCTIONS ---
// We attach these to the window object so the onclick attributes in index.html can find them.
function initializeAppManagement() {
    window.launchAudPlayer = () => { terminal.style.display = 'none'; audplayerWindow.style.display = 'flex'; audplayerContent.src = './audplayer.html'; audplayerContent.focus(); }
    window.closeAudPlayer = () => { audplayerWindow.style.display = 'none'; audplayerContent.src = 'about:blank'; audplayerTaskbarItem.style.display = 'none'; terminal.style.display = 'block'; mobileButtons.style.bottom = '0px'; input.focus(); }
    window.minimizeAudPlayer = () => { audplayerWindow.style.display = 'none'; audplayerTaskbarItem.style.display = 'block'; terminal.style.display = 'block'; mobileButtons.style.bottom = `${taskbar.offsetHeight}px`; input.focus(); }
    window.restoreAudPlayer = () => { audplayerTaskbarItem.style.display = 'none'; notesAppWindow.style.display = 'none'; notesAppTaskbarItem.style.display = 'none'; audplayerWindow.style.display = 'flex'; terminal.style.display = 'none'; mobileButtons.style.bottom = '0px'; audplayerContent.focus(); }
    
    window.launchNotesApp = () => { terminal.style.display = 'none'; notesAppWindow.style.display = 'flex'; notesAppContent.src = './notes.html'; notesAppContent.focus(); }
    window.closeNotesApp = () => { notesAppWindow.style.display = 'none'; notesAppContent.src = 'about:blank'; notesAppTaskbarItem.style.display = 'none'; terminal.style.display = 'block'; mobileButtons.style.bottom = '0px'; input.focus(); }
    window.minimizeNotesApp = () => { notesAppWindow.style.display = 'none'; notesAppTaskbarItem.style.display = 'block'; terminal.style.display = 'block'; mobileButtons.style.bottom = `${taskbar.offsetHeight}px`; input.focus(); }
    window.restoreNotesApp = () => { notesAppTaskbarItem.style.display = 'none'; audplayerWindow.style.display = 'none'; audplayerTaskbarItem.style.display = 'none'; notesAppWindow.style.display = 'flex'; terminal.style.display = 'none'; mobileButtons.style.bottom = '0px'; notesAppContent.focus(); }
}

// --- INITIALIZER ---
export function initializeAppWindows() {
    makeDraggable(audplayerWindow);
    makeDraggable(notesAppWindow);
    initializeAppManagement();
    insertCommand(); // Initialize the global function
}
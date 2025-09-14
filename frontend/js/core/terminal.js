import { commands } from './command-handler.js';
import { initializeAppWindows } from '../apps/app-manager.js';

// --- DOM ELEMENTS ---
const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const outputContainer = document.getElementById('output-container');
const scrollAnchor = document.getElementById('scroll-anchor');
const currentPrompt = document.getElementById('current-prompt');
const mobileButtons = document.getElementById('mobile-buttons');

// --- STATE ---
let commandHistory = [], historyIndex = -1;
export let directoryStructure = {};
export let currentPath = []; 

// --- CORE FUNCTIONS ---
export function getFullPath() { return currentPath.join('/'); }
export function getTopLevelDir() { return currentPath.length > 0 ? `${currentPath[0]}/` : '~'; }
export function updateCurrentPath(newPath) { currentPath = newPath; }

function updatePrompt() {
    const path = `~/${getFullPath()}`;
    currentPrompt.textContent = `monadmelon@web:${path}$`; 
}

function addOutput(text, isCommand = false) { 
    const output = document.createElement('div'); 
    output.className = 'output'; 
    if (isCommand) { 
        output.innerHTML = `<span class="prompt">${currentPrompt.textContent} </span><span class="command">${text}</span>`; 
    } else { 
        output.textContent = text; 
    } 
    outputContainer.appendChild(output); 
    scrollToBottom(); 
}

async function handleCommand() { 
    const fullCommand = input.value.trim(); 
    if (!fullCommand) return; 
    addOutput(fullCommand, true); 
    
    const args = fullCommand.split(' '); 
    const cmd = args[0].toLowerCase(); 
    
    if (commands[cmd]) { 
        const result = await commands[cmd](args.slice(1)); 
        if (result) addOutput(result); 
    } else { 
        addOutput(`${cmd}: command not found.`); 
    } 
    
    commandHistory.push(fullCommand); 
    historyIndex = commandHistory.length; 
    input.value = ''; 
    scrollToBottom(); 
}

function scrollToBottom() { scrollAnchor.scrollIntoView(); }

// --- INITIALIZATION ---
async function initializeFileSystem() {
    const fsMountMessage = document.getElementById('filesystem-mount-message');
    try {
        const response = await fetch('./filesystem.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        directoryStructure = await response.json();
        fsMountMessage.innerHTML += '[OK]';
    } catch (error) {
        fsMountMessage.innerHTML += '<span style="color: #ff0000;">[FAILED]</span>';
        console.error("Failed to load filesystem:", error);
        directoryStructure = { '~': ['ERROR.txt'] };
    }
}

function initializeTerminal() {
    const bootScreen = document.getElementById('boot-screen');
    setTimeout(() => {
        if(bootScreen) {
            bootScreen.style.opacity = 0;
            setTimeout(() => {
                bootScreen.style.display = 'none';
                terminal.style.display = 'block';
                mobileButtons.style.visibility = 'visible';
                mobileButtons.style.opacity = 1;
                input.focus();
            }, 1000);
        }
    }, 8000);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { handleCommand(); }
        else if (e.key === 'ArrowUp') { 
            e.preventDefault(); 
            if (commandHistory.length > 0) { 
                historyIndex = Math.max(0, historyIndex - 1); 
                input.value = commandHistory[historyIndex] || ''; 
            } 
        }
        else if (e.key === 'ArrowDown') { 
            e.preventDefault(); 
            historyIndex++; 
            input.value = historyIndex < commandHistory.length ? commandHistory[historyIndex] : ''; 
            if (historyIndex >= commandHistory.length) { 
                historyIndex = commandHistory.length; 
            } 
        }
    });
    terminal.addEventListener('click', () => input.focus());
}

// --- STARTUP ---
document.addEventListener('DOMContentLoaded', async () => {
    initializeAppWindows();
    await initializeFileSystem();
    initializeTerminal();
    updatePrompt();
});
// File: frontend/js/core/terminal.js

import { commands } from './command-handler.js';
import { initializeAppWindows } from '../apps/app-manager.js';
import { isChatting, exitChat, askSuika } from '../apps/suika-manager.js';

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
export function updateCurrentPath(newPath) { currentPath = newPath; updatePrompt(); }

function updatePrompt() {
    if (!isChatting()) {
        const path = `~/${getFullPath()}`;
        currentPrompt.textContent = `monadmelon@web:${path}$`; 
    }
}

function addOutput(text, isCommand = false) { 
    const output = document.createElement('div'); 
    output.className = 'output';
    const promptText = isChatting() ? `>> ` : `${currentPrompt.textContent} `;
    if (isCommand) { 
        output.innerHTML = `<span class="prompt">${promptText}</span><span class="command">${text}</span>`; 
    } else { 
        output.textContent = text; 
    } 
    outputContainer.appendChild(output); 
    scrollToBottom(); 
}

async function handleCommand() { 
    const fullInput = input.value.trim(); 
    if (!fullInput) return;
    if (isChatting()) {
        addOutput(fullInput, true);
        input.value = '';
        if (fullInput.toLowerCase() === 'bye' || fullInput.toLowerCase() === 'exit') {
            exitChat();
            updatePrompt();
            addOutput("> Suika has returned to the background.");
            return;
        }
        const thinkingMsg = document.createElement('div');
        thinkingMsg.className = 'output';
        thinkingMsg.textContent = '> Suika is thinking...';
        outputContainer.appendChild(thinkingMsg);
        scrollToBottom();
        const response = await askSuika(fullInput);
        thinkingMsg.textContent = response;
        scrollToBottom();
    } else {
        addOutput(fullInput, true);
        const args = fullInput.split(' '); 
        const cmd = args[0].toLowerCase(); 
        if (commands[cmd]) { 
            const result = await commands[cmd](args.slice(1)); 
            if (result) addOutput(result); 
        } else { 
            addOutput(`${cmd}: command not found.`); 
        } 
        commandHistory.push(fullInput); 
        historyIndex = commandHistory.length; 
        input.value = ''; 
        scrollToBottom(); 
    }
}

function scrollToBottom() { scrollAnchor.scrollIntoView(); }

// --- INITIALIZATION ---
async function initializeFileSystem() {
    const bootMsg = document.getElementById('filesystem-mount-message');
    try {
        const response = await fetch('./filesystem.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        directoryStructure = await response.json();
        bootMsg.textContent += ' [OK]';
    } catch (error) {
        console.error("Fatal Error: Could not load virtual filesystem.", error);
        bootMsg.textContent += ' [FAILED]';
        const errorMsg = document.createElement('div');
        errorMsg.className = 'boot-message';
        errorMsg.style.color = '#ff0000';
        errorMsg.textContent = '> ERROR: VFS NOT FOUND. Cannot boot. Check filesystem.json path.';
        bootMsg.parentNode.insertBefore(errorMsg, bootMsg.nextSibling);
        return false;
    }
    return true;
}

function initializeTerminal() {
    const bootScreen = document.getElementById('boot-screen');
    const bootMessages = bootScreen.querySelectorAll('.boot-message, .ascii-art-line');

    // Add a "power-off" effect to the boot text
    bootMessages.forEach(el => {
        el.style.transition = 'opacity 0.2s ease-out';
        el.style.opacity = '0';
    });

    // After the text fades, hide the boot screen and show the terminal
    setTimeout(() => {
        bootScreen.style.display = 'none';
        terminal.style.display = 'block';
        if (window.innerWidth <= 768) {
             mobileButtons.style.visibility = 'visible';
             mobileButtons.style.opacity = '1';
        }
        input.focus();
        scrollToBottom();
    }, 300); // Wait for the new power-off effect to finish

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { handleCommand(); } 
        else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) historyIndex--;
            input.value = commandHistory[historyIndex] || '';
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) historyIndex++;
            input.value = commandHistory[historyIndex] || '';
        }
    });

    terminal.addEventListener('click', () => {
        if (window.getSelection().toString() === '') {
            input.focus();
        }
    });
}

// --- STARTUP ---
document.addEventListener('DOMContentLoaded', async () => {
    initializeAppWindows();
    const fsLoaded = await initializeFileSystem(); 
    if (fsLoaded) {
        // Wait for the full boot animation to play out before transitioning
        setTimeout(initializeTerminal, 8000); 
    }
    updatePrompt();
});
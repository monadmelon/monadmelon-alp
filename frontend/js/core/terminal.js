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
function alignBootStatus(element, status) {
    const targetLength = 35; 
    const currentText = element.textContent;
    const dotsNeeded = targetLength - currentText.length;
    if (dotsNeeded > 0) {
        element.textContent = currentText + '.'.repeat(dotsNeeded) + ` ${status}`;
    }
}

async function initializeFileSystem() {
    const fsMountMessage = document.getElementById('filesystem-mount-message');
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); 
        const response = await fetch('./filesystem.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        directoryStructure = await response.json();
        alignBootStatus(fsMountMessage, '[OK]');
    } catch (error) {
        alignBootStatus(fsMountMessage, '[FAILED]');
        console.error("Failed to load filesystem:", error);
        directoryStructure = { '~': ['ERROR.txt'] };
    }
}

function initializeTerminal() {
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.classList.add('stage-fade-out');
    setTimeout(() => {
        bootScreen.style.display = 'none';
        terminal.style.display = 'block';
        if (window.innerWidth <= 768) {
             mobileButtons.style.visibility = 'visible';
             mobileButtons.style.opacity = '1';
        }
        input.focus();
        scrollToBottom();
    }, 300);

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

// --- STARTUP SEQUENCE ---
document.addEventListener('DOMContentLoaded', async () => {
    initializeAppWindows();
    await initializeFileSystem();
    updatePrompt();

    const stage1 = document.getElementById('boot-stage-1');
    const stage2 = document.getElementById('boot-stage-2');
    const daemonStatus = document.getElementById('daemon-status-message');
    const originalDaemonText = daemonStatus.textContent;
    
    // **THE FIX IS HERE: Reinstated the loading animation**
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 13; // Cycle through 0-12 dots
        daemonStatus.textContent = originalDaemonText + '.'.repeat(dotCount);
    }, 200);

    // This is the main timer for the whole boot sequence
    setTimeout(() => {
        clearInterval(dotInterval); // Stop the dot animation
        alignBootStatus(daemonStatus, '[OK]'); // Set the final, aligned status
        
        stage1.classList.add('stage-fade-out');

        setTimeout(() => {
            stage1.style.display = 'none';
            stage2.classList.add('stage-fade-in');

            setTimeout(initializeTerminal, 2000); 

        }, 400);

    }, 6500);
});
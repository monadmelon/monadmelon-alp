// File: frontend/js/apps/suika-manager.js

let isChattingWithSuika = false;
const catIconElement = document.createElement('span');
catIconElement.textContent = '[<_>] ';
catIconElement.style.color = '#00ff00';

// A simple function to check the current chat state from other modules
export function isChatting() {
    return isChattingWithSuika;
}

// Called by the 'suika' command to START the chat
export function enterChat() {
    isChattingWithSuika = true;
    const promptElement = document.getElementById('current-prompt');
    // Change the prompt to a simple chat indicator
    promptElement.textContent = '>>';
    // Add the cat icon
    promptElement.parentNode.insertBefore(catIconElement, promptElement);
}

// Called from the terminal when the user types 'bye'
export function exitChat() {
    isChattingWithSuika = false;
    // Remove the cat icon if it exists
    if (catIconElement.parentNode) {
        catIconElement.parentNode.removeChild(catIconElement);
    }
}

// The core function that communicates with the backend
export async function askSuika(query) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/suika', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query }),
        });
        if (!response.ok) {
            return `> Suika seems to be... unavailable. (Error: ${response.status})`;
        }
        const data = await response.json();
        return `> ${data.response}`;
    } catch (error) {
        console.error("Error asking Suika:", error);
        return "> Connection to Suika's consciousness failed.";
    }
}
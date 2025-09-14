// File: frontend/js/commands/clear.js
export function clear() {
    // We need to access the DOM element to clear it.
    document.getElementById('output-container').innerHTML = '';
    return ''; // Commands should return a string or nothing.
}
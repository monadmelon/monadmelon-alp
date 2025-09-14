// File: frontend/js/commands/ls.js
import { directoryStructure, currentPath } from '../core/terminal.js';

export function ls() {
    // Case 1: We are at the root ('~')
    if (currentPath.length === 0) {
        return Object.keys(directoryStructure).filter(k => k !== '~').join('    ');
    }

    // Case 2: We are in a subdirectory
    const topLevelDir = `${currentPath[0]}/`;
    const allEntries = directoryStructure[topLevelDir] || [];
    
    // e.g., if currentPath is ['log', 'C'], this becomes 'C/'
    const prefix = currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '');
    
    const displaySet = new Set();
    for (const entry of allEntries) {
        if (entry.startsWith(prefix) && entry !== prefix) {
            const relative = entry.substring(prefix.length);
            const parts = relative.split('/');
            
            // Add the first part of the relative path. If it's a directory, add a slash.
            if (parts[0]) {
                const item = parts.length > 1 && parts[1] !== '' ? `${parts[0]}/` : parts[0];
                displaySet.add(item);
            }
        }
    }
    
    return Array.from(displaySet).sort().join('    ');
}
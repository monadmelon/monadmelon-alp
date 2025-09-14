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
    const prefix = currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '');

    const displaySet = new Set();

    for (const entry of allEntries) {
        // Find entries that are direct children of the current path
        if (entry.startsWith(prefix) && entry !== prefix) {
            const relativePath = entry.substring(prefix.length);
            
            if (relativePath) {
                const parts = relativePath.split('/');
                const firstPart = parts[0];
                
                // A simple, reliable check: if the relative path contains a '/', it represents a directory.
                const isDir = relativePath.includes('/');
                displaySet.add(isDir ? `${firstPart}/` : firstPart);
            }
        }
    }
    
    return Array.from(displaySet).sort().join('    ');
}
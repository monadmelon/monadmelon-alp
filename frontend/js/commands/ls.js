// File: frontend/js/commands/ls.js
import { directoryStructure, currentPath } from '../core/terminal.js';

export function ls() {
    // Case 1: We are at the root ('~'). The root listing is special.
    if (currentPath.length === 0) {
        return (directoryStructure['~'] || []).join('    ');
    }

    // Case 2: We are in a subdirectory.
    const topLevelDir = `${currentPath[0]}/`;
    const allEntries = directoryStructure[topLevelDir] || [];
    
    // Create the path prefix for the current subdirectory, e.g., 'C/'
    const pathPrefix = currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '');
    
    const displaySet = new Set();

    for (const entry of allEntries) {
        // Find entries that are direct children of the current path
        if (entry.startsWith(pathPrefix) && entry !== pathPrefix) {
            const relativePath = entry.substring(pathPrefix.length);
            const parts = relativePath.split('/');
            const itemToShow = parts[0];

            if (itemToShow) {
                // If the entry represents a directory, add a trailing slash
                if (entry.endsWith('/') || parts.length > 1) {
                    displaySet.add(`${itemToShow}/`);
                } else {
                    displaySet.add(itemToShow);
                }
            }
        }
    }
    
    return Array.from(displaySet).sort().join('    ');
}
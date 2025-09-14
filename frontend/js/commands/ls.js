// File: frontend/js/commands/ls.js
import { directoryStructure, currentPath } from '../core/terminal.js';

export function ls() {
    // If we are at the root, just show the top-level directories
    if (currentPath.length === 0) {
        return Object.keys(directoryStructure).filter(k => k !== '~').join('    ');
    }

    const topLevelDir = `${currentPath[0]}/`;
    const allEntries = directoryStructure[topLevelDir] || [];
    
    // Create the path prefix for the current subdirectory, e.g., 'C/' or 'C/another_folder/'
    const currentPathPrefix = currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '');
    
    const displaySet = new Set();

    for (const entry of allEntries) {
        // Find entries that start with our current path prefix
        if (entry.startsWith(currentPathPrefix)) {
            // Get the rest of the path after the prefix
            const relativePath = entry.substring(currentPathPrefix.length);
            
            // If there's content, get the first part of it
            if (relativePath) {
                const parts = relativePath.split('/');
                const item = parts.length > 1 ? `${parts[0]}/` : parts[0];
                displaySet.add(item);
            }
        }
    }
    
    return Array.from(displaySet).sort().join('    ');
}
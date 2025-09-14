// File: frontend/js/commands/cd.js
import { directoryStructure, currentPath, updateCurrentPath } from '../core/terminal.js';

export function cd(args) {
    if (!args[0] || args[0] === '~') {
        updateCurrentPath([]);
        return;
    }
    
    const target = args[0].replace(/\/$/, '');

    if (target === '..') {
        if (currentPath.length > 0) currentPath.pop();
        updateCurrentPath(currentPath);
        return;
    }

    // Case 1: changing from the root directory
    if (currentPath.length === 0) {
        if (directoryStructure[`${target}/`]) {
            updateCurrentPath([target]);
        } else {
            return `cd: ${target}: No such directory`;
        }
        return;
    }

    // Case 2: changing from a subdirectory
    const topLevelDir = `${currentPath[0]}/`;
    const allEntries = directoryStructure[topLevelDir] || [];
    const newPathPrefix = [...currentPath.slice(1), target].join('/') + '/';
    
    const isValidDir = allEntries.some(entry => entry.startsWith(newPathPrefix));

    if (isValidDir) {
        updateCurrentPath([...currentPath, target]);
    } else {
        return `cd: ${target}: No such directory`;
    }
}
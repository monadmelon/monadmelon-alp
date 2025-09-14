// File: frontend/js/commands/cd.js
import { directoryStructure, currentPath, updateCurrentPath } from '../core/terminal.js';

export function cd(args) {
    if (!args[0] || args[0] === '~') {
        updateCurrentPath([]);
        return;
    }
    
    const target = args[0].replace(/\/$/, ''); // remove trailing slash if present

    if (target === '..') {
        if (currentPath.length > 0) {
            currentPath.pop();
            updateCurrentPath(currentPath);
        }
        return;
    }

    // Handle cd into a top-level directory from root
    if (currentPath.length === 0) {
        if (directoryStructure[`${target}/`]) {
            updateCurrentPath([target]);
        } else {
            return `cd: ${target}: No such directory`;
        }
        return;
    }

    // Handle cd into a subdirectory
    const topLevelDir = `${currentPath[0]}/`;
    const allEntries = directoryStructure[topLevelDir] || [];
    const newPathPrefix = [...currentPath.slice(1), target].join('/') + '/';

    const isValidDir = allEntries.some(entry => entry === newPathPrefix || entry.startsWith(newPathPrefix));

    if (isValidDir) {
        const newPath = [...currentPath, target];
        updateCurrentPath(newPath);
    } else {
        return `cd: ${target}: No such directory`;
    }
}
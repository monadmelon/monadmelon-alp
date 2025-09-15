// File: frontend/js/commands/cd.js
import { directoryStructure, currentPath, updateCurrentPath } from '../core/terminal.js';

export function cd(args) {
    const target = args[0];

    // Case 1: Go to root
    if (!target || target === '~' || target === '/') {
        updateCurrentPath([]);
        return;
    }

    // Case 2: Go up one level
    if (target === '..') {
        if (currentPath.length > 0) {
            currentPath.pop();
            updateCurrentPath(currentPath);
        }
        return;
    }

    // Normalize the target directory name
    const targetDir = target.replace(/\/$/, '');
    const newPathArray = [...currentPath, targetDir];

    let isValidDirectory = false;

    if (currentPath.length === 0) {
        // From the root, the target must be in the "~" list with a trailing slash.
        isValidDirectory = (directoryStructure['~'] || []).includes(`${targetDir}/`);
    } else {
        // In a subdirectory, the new path must exist as a prefix in the file list.
        const topLevelDir = `${currentPath[0]}/`;
        const allEntries = directoryStructure[topLevelDir] || [];
        const pathToCheck = newPathArray.slice(1).join('/') + '/';
        isValidDirectory = allEntries.some(entry => entry.startsWith(pathToCheck));
    }
    
    if (isValidDirectory) {
        updateCurrentPath(newPathArray);
    } else {
        return `cd: ${target}: No such directory`;
    }
}
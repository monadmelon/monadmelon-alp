// File: frontend/js/commands/cat.js
import { directoryStructure, currentPath } from '../core/terminal.js';

export async function cat(args) {
    if (!args[0]) {
        return "cat: missing argument";
    }
    const pathArg = args.join(' ');

    if (pathArg.endsWith('/')) {
        return `cat: ${pathArg}: Is a directory`;
    }

    let fetchPath = '';
    let exists = false;

    // Case 1: At the root ('~')
    if (currentPath.length === 0) {
        exists = (directoryStructure['~'] || []).includes(pathArg);
        if (exists) {
            // **THE FIX:** Differentiate between the project's README.md and content files
            if (pathArg === 'README.md') {
                fetchPath = `./${pathArg}`; // Fetch from the project root
            } else {
                fetchPath = `./content/${pathArg}`; // Fetch from the content folder
            }
        }
    } else {
        // Case 2: In a subdirectory
        const topLevelDir = `${currentPath[0]}/`;
        const allEntries = directoryStructure[topLevelDir] || [];
        const virtualPath = currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '') + pathArg;
        
        exists = allEntries.includes(virtualPath);
        if (exists) {
            fetchPath = `./content/${topLevelDir}${virtualPath}`;
        }
    }

    if (exists) {
        try {
            const response = await fetch(fetchPath);
            if (!response.ok) {
                return `cat: error fetching '${pathArg}': ${response.statusText}`;
            }
            return await response.text();
        } catch (error) {
            return `cat: network error fetching '${pathArg}'`;
        }
    } else {
        return `cat: ${pathArg}: No such file or directory`;
    }
}
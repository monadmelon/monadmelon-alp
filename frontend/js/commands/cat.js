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

    // A simple check for cat at root, which is not supported for files
    if (currentPath.length === 0) {
        return `cat: ${pathArg}: No such file or directory in root`;
    }
    
    // Construct the path relative to the top-level directory
    // e.g., if currentPath is ['log', 'C'], this becomes 'C/c_info.txt'
    const topLevelDir = `${currentPath[0]}/`;
    const pathWithinTopDir = (currentPath.slice(1).join('/') + (currentPath.length > 1 ? '/' : '') + pathArg);

    const entries = directoryStructure[topLevelDir] || [];

    // Check if this exact path exists in our filesystem list
    if (entries.includes(pathWithinTopDir)) {
        try {
            // The fetch path is always content + topLevelDir + pathWithinTopDir
            const fetchPath = `./content/${topLevelDir}${pathWithinTopDir}`;
            const response = await fetch(fetchPath);
            if (!response.ok) {
                return `cat: error fetching '${pathArg}'`;
            }
            return await response.text();
        } catch (error) {
            return `cat: network error fetching '${pathArg}'`;
        }
    } else {
        return `cat: ${pathArg}: No such file or directory`;
    }
}
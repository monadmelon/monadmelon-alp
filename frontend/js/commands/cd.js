import { directoryStructure, currentPath, updateCurrentPath, getTopLevelDir } from '../core/terminal.js';

export function cd(args) {
    if (!args[0]) { 
        return; // No-op for empty cd, could also go to ~
    }
    const target = args[0].replace(/\/$/, '');

    if (target === '~') {
        updateCurrentPath([]);
    } else if (target === '..') {
        if (currentPath.length > 0) {
            const newPath = [...currentPath];
            newPath.pop();
            updateCurrentPath(newPath);
        }
    } else {
        const newPath = [...currentPath, target];
        const newPathStr = newPath.join('/') + '/';
        const topLevelDirKey = getTopLevelDir();
        const entries = directoryStructure[topLevelDirKey] || (topLevelDirKey === '~' ? Object.keys(directoryStructure).filter(k=>k!=='~') : []);
        
        const isRootDir = currentPath.length === 0 && directoryStructure[`${target}/`];
        const isValidSubDir = entries.some(p => p === newPathStr || p.startsWith(newPathStr));

        if (isRootDir) {
            updateCurrentPath([target]);
        } else if (isValidSubDir) {
            updateCurrentPath(newPath);
        } else {
            return `cd: ${target}: No such directory`;
        }
    }
}
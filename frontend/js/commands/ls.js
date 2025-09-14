import { directoryStructure, currentPath, getFullPath, getTopLevelDir } from '../core/terminal.js';

export function ls() {
    const topLevelDirKey = getTopLevelDir();
    if (!directoryStructure[topLevelDirKey]) return '';
    const allEntries = directoryStructure[topLevelDirKey];
    const currentPathStr = getFullPath();
    const pathPrefix = currentPath.length > 0 ? currentPathStr + '/' : '';

    if (currentPath.length === 0) {
        return Object.keys(directoryStructure).filter(k => k !== '~').join('    ');
    }

    const displaySet = new Set();
    allEntries.forEach(p => {
        if (p.startsWith(pathPrefix)) {
            const subPath = p.substring(pathPrefix.length);
            const parts = subPath.split('/');
            if (parts[0]) {
                displaySet.add(parts.length > 1 && parts[1] !== '' ? `${parts[0]}/` : parts[0]);
            }
        }
    });

    return Array.from(displaySet).sort().join('    ');
}
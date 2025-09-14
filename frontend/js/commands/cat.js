import { directoryStructure, getFullPath, getTopLevelDir } from '../core/terminal.js';

export async function cat(args) {
    if (!args[0]) return "cat: missing argument";
    const pathArg = args.join(' ');
    
    const fullPath = getFullPath() ? `${getFullPath()}/${pathArg}` : pathArg;
    const topLevelDirKey = getTopLevelDir();
    const entries = directoryStructure[topLevelDirKey] || [];

    if (fullPath.endsWith('/')) return `cat: ${pathArg}: Is a directory`;

    if (entries.includes(fullPath)) {
        try {
            const response = await fetch(`./content/${topLevelDirKey}${fullPath}`);
            if (!response.ok) return `cat: error fetching '${pathArg}'`;
            return await response.text();
        } catch (error) { return `cat: network error fetching '${pathArg}'`; }
    } else {
        return `cat: ${pathArg}: No such file or directory`;
    }
}
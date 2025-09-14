// File: frontend/js/commands/pwd.js
import { getFullPath } from '../core/terminal.js';
export function pwd() {
    return `~/${getFullPath()}`;
}
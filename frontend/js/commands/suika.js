// File: frontend/js/commands/suika.js
import { enterChat } from '../apps/suika-manager.js';

export function suika(args) {
    // This command's only job is to put the terminal into chat mode.
    enterChat();
    return "> Suika is listening...";
}
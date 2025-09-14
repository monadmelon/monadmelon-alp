// File: frontend/js/core/command-handler.js

// Import all individual command modules
import { help } from '../commands/help.js';
import { whoami } from '../commands/whoami.js';
import { ls } from '../commands/ls.js';
import { cd } from '../commands/cd.js';
import { pwd } from '../commands/pwd.js';
import { cat } from '../commands/cat.js';
import { clear } from '../commands/clear.js';
import { date } from '../commands/date.js';
import { echo } from '../commands/echo.js';
import { audplayer } from '../commands/audplayer.js';
import { notes } from '../commands/notes.js';

// Export the complete commands object that terminal.js will use
export const commands = {
    help,
    whoami,
    ls,
    cd,
    pwd,
    cat,
    clear,
    date,
    echo,
    audplayer,
    notes,
};
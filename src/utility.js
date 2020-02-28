const readline = require('readline');

const print = text_arr => {
    text_arr.forEach(e => console.log(e));
}

const cursor_to_begining = _ => {
    readline.cursorTo(process.stdout, 0, 0);
}

const clear_screen = _ => {
    cursor_to_begining();
    readline.clearScreenDown(process.stdout);
}

module.exports = {
    print,
    cursor_to_begining,
    clear_screen
}
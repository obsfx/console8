const {
    white,
    red, 
    green, 
    yellow, 
    blue, 
    magenta, 
    cyan 
} = require('kleur');

module.exports = {
    ANSI_SHOW_CURSOR: '\033[?25h',
    ANSI_HIDE_CURSOR: '\033[?25l',

    RENDERING_CHAR: '\u2588',

    COLORS: {
        white,
        red,
        green,
        yellow,
        blue,
        magenta,
        cyan
    },

    KEYS: [
        2,  3,  4,  5,      // | 1 | 2 | 3 | 4 |
        16, 17, 18, 19,     // | Q | W | E | R |
        30, 31, 32, 33,     // | A | S | D | F |
        44, 45, 46, 47      // | Z | X | C | V |
    ],

    TIME: {
        now: 0,
        then: Date.now(),
        time_elapsed: 0,
        speed: 320,
        fps_interval: 1000 / 320
    },

    PREP_STATE: 0,
    LOOP_STATE: 1
}
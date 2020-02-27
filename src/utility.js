const readline = require('readline');

const config = require('./config');

const texts = {
    help: [
        'console8: help',

        `\t ${config.COLORS.yellow('args:')}`,
        `\t\t --rom=<single file rom path> eg: --rom=./wipeoff.rom\n`,

        `\t\t --color=<rendering color of ON bits> (optional, default: white)`,
        `\t\t\t available colors: white, red, green, yellow, blue, magenta, cyan\n`,

        `\t\t --speed=<speed of cycle execution> (optional, default: 320)\n`,

        `\t\t --rendering_char=<ascii char that represents ON bits> (optional, default: ${config.RENDERING_CHAR})\n`,

        `\t ${config.COLORS.yellow('keys:')}`,

        `\t\t [CTRL] + [E]: Terminate the emulator.`,

        `\t\t controls:`,
        `\t\t [ 1 ] | [ 2 ] | [ 3 ] | [ 4 ]`,
        `\t\t [ Q ] | [ W ] | [ E ] | [ R ]`,
        `\t\t [ A ] | [ S ] | [ D ] | [ F ]`,
        `\t\t [ Z ] | [ X ] | [ C ] | [ V ]`
    ],

    missing_rom_arg_warning: [
        'console8: missing --rom argument \n',

        `\t ${config.COLORS.yellow('Please specify a correct CHIP8 ROM file path by using --rom argument.')}`,
        `\t\t If you want to see more information you can use the --help argument.`,
        `\t\t ${config.COLORS.green('console8 --help')}`,
        ""
    ],

    speed_arg_warning: [
        'console8: --speed argument value must be an integer\n',

        `\t ${config.COLORS.yellow('Please specify --speed value as an integer.')}`,
        `\t\t If you want to see more information you can use the --help argument.`,
        `\t\t ${config.COLORS.green('console8 --help')}`,
        ""
    ],

    color_arg_warning: [
        'console8: invalid color\n',

        `\t ${config.COLORS.yellow('Please specify a valid and available color name.')}`,
        `\t ${config.COLORS.yellow('Here is the available colors list: white, red, green, yellow, blue, magenta, cyan')}`,
        `\t\t If you want to see more information you can use the --help argument.`,
        `\t\t ${config.COLORS.green('console8 --help')}`,
        ""
    ],

    rom_path_warning: [
        'console8: rom file path warning\n',

        `\t ${config.COLORS.yellow('ROM file couldn\'t found. Please check the file path.')}`,
        `\t\t If you want to see more information you can use the --help argument.`,
        `\t\t ${config.COLORS.green('console8 --help')}`,
        ""
    ]
}

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
    texts,
    print,
    cursor_to_begining,
    clear_screen
}
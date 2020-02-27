const fs = require('fs');
const readline = require('readline');

const argv = require('minimist')(process.argv.slice(2));

const config = require('./config');
const utility = require('./utility');
const chip8_cpu = require('./cpu');

if (argv.help) {
    utility.print(utility.texts.help);
    process.exit(0);
}

let error_list = [];

if (!argv.rom) {
    error_list = [ ...error_list, ...utility.texts.missing_rom_arg_warning ];
}

if (argv.speed && !Number.isInteger(argv.speed)) {
    error_list = [ ...error_list, ...utility.texts.speed_arg_warning ];
}

if (argv.color && Object.keys(config.COLORS).indexOf(argv.color) < 0) {
    error_list = [ ...error_list, ...utility.texts.color_arg_warning ];
}

if (!fs.existsSync(argv.rom)) {
    error_list = [ ...error_list, ...utility.texts.rom_path_warning ];
}

if (error_list.length > 0) {
    utility.print(error_list);
    process.exit(1);
}

const iohook = require('iohook');

iohook.on('keydown', e => {
    if (e.keycode == 18 && e.ctrlKey) {
        process.stdout.write(config.ANSI_SHOW_CURSOR);
        utility.clear_screen();
        console.log('terminated');
        process.exit(0);
    }

    if (e.keycode == 28 && STATE == config.PREP_STATE) {
        STATE = config.LOOP_STATE;
        utility.clear_screen();
        loop();
    }

    for (let i = 0, len = config.KEYS.length; i < len; i++) {
        if (e.keycode == config.KEYS[i]) {
            cpu.keypad[i] = 1;
            break;
        }
    }
});

iohook.on('keyup', e => {
    for (let i = 0, len = config.KEYS.length; i < len; i++) {
        if (e.keycode == config.KEYS[i]) {
            cpu.keypad[i] = 0;
            break;
        }
    }
});

iohook.start();

let STATE = config.PREP_STATE;

let rom_buffer = fs.readFileSync(argv.rom);
let rendering_color = (argv.color) ? config.COLORS[argv.color] : config.COLORS['white'];
// let rendering_char = argv.rendering_char

let cpu = new chip8_cpu();
cpu.load_rom(rom_buffer);

utility.clear_screen();
utility.print(utility.texts.prep_state_text);

let OUTPUT = '';

const loop = _ => {
    config.TIME.now = Date.now();
    config.TIME.time_elapsed = config.TIME.now - config.TIME.then;
    // deltaTime += now - then;
    if (config.TIME.time_elapsed > config.TIME.fps_interval) {
        config.TIME.then = config.TIME.now - ((config.TIME.now - config.TIME.then) % (config.TIME.fps_interval));

        cpu.execute_cycle();

        OUTPUT = '';

        if (cpu.draw_flag) {
            utility.cursor_to_begining();

            for (let i = 0, len = cpu.video.length; i < len; i++) {
                if (cpu.video[i] == 0xFF) {
                    // process.stdout.write('#');
                    OUTPUT += config.RENDERING_CHAR;
                    // output += '■';
                } else {
                    // process.stdout.write(' ');
                    OUTPUT += ' ';
                }
    
                if ((i + 1) % 64 == 0) {
                    OUTPUT += "\n";
                }
            }

            cpu.draw_flag = false;

            process.stdout.write(`${rendering_color(OUTPUT)}\n${config.ANSI_HIDE_CURSOR}`);
        }
    }

    setImmediate(loop);
}

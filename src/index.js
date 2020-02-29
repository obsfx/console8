const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));

const config = require('./config');
const utility = require('./utility');
const outputs = require('./outputs');
const chip8_cpu = require('./cpu');

if (argv.help) {
    utility.print(outputs.help);
    process.exit(0);
}

let error_list = [];

if (!argv.rom) {
    error_list = [ ...error_list, ...outputs.missing_rom_arg_warning ];
}

if (argv.speed != undefined && !Number.isInteger(argv.speed)) {
    error_list = [ ...error_list, ...outputs.speed_arg_warning ];
}

if (argv.color != undefined && Object.keys(config.COLORS).indexOf(argv.color) < 0) {
    error_list = [ ...error_list, ...outputs.color_arg_warning ];
}

if (!fs.existsSync(argv.rom)) {
    error_list = [ ...error_list, ...outputs.rom_path_warning ];
}

if (error_list.length > 0) {
    utility.print(error_list);
    process.exit(1);
}

const iohook = require('iohook');

iohook.on('keydown', e => {

    // if (e.keycode == 18 && e.ctrlKey) {
    //     utility.clear_screen();
    //     process.stdout.write(config.ANSI_SHOW_CURSOR);
    //     process.stdin.setRawMode(false);
    //     process.stdin.resume();
    //     process.exit(0);
    // }

    if (e.keycode == 19 && e.ctrlKey && STATE == config.LOOP_STATE) {
        STATE = config.PREP_STATE;
        cpu.reset();
        utility.clear_screen();
        STATE = config.LOOP_STATE;
        loop();
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
let fps_interval = (argv.speed) ? 1000 / argv.speed : config.TIME.fps_interval;
let rendering_char = argv.rendering_char || config.RENDERING_CHAR;

let cpu = new chip8_cpu();
cpu.load_rom(rom_buffer);

utility.clear_screen();
utility.print(outputs.prep_state_text);

let OUTPUT = '';

const loop = _ => {
    config.TIME.now = Date.now();
    config.TIME.time_elapsed = config.TIME.now - config.TIME.then;

    if (config.TIME.time_elapsed > fps_interval) {
        config.TIME.then = config.TIME.now - (config.TIME.time_elapsed % fps_interval);

        cpu.execute_cycle();

        OUTPUT = '';

        if (cpu.draw_flag) {
            utility.clear_screen();


            for (let i = 0, len = cpu.video.length; i < len; i++) {
                if (cpu.video[i] == 0xFF) {
                    OUTPUT += rendering_char;
                } else {
                    OUTPUT += ' ';
                }
    
                if ((i + 1) % 64 == 0) {
                    OUTPUT += "\n";
                }
            }

            cpu.draw_flag = false;

            process.stdout.write(`${rendering_color(OUTPUT)}\n`);
        }
    }

    if (STATE == config.LOOP_STATE) {
        setImmediate(loop);
    }
}

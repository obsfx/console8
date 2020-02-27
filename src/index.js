const fs = require('fs');
const readline = require('readline');

// const iohook = require('iohook');
const argv = require('minimist')(process.argv.slice(2));

const config = require('./config');
const utility = require('./utility');
const chip8_cpu = require('./cpu');

// readline.cursorTo(process.stdout, 0, 0);
// readline.clearScreenDown(process.stdout);

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

console.log(process.stdout.columns, process.stdout.rows);

let rom_buffer = fs.readFileSync(argv.rom);
let rendering_color = (argv.color) ? config.COLORS[argv.color] : config.COLORS['white'];



// let rom = fs.readFileSync(argv.rom);
// let c = colors[argv.color];

// let cpu = new chip8_cpu();
// cpu.load_rom(rom);

// iohook.on('keydown', e => {
//     if (e.keycode == 18 && e.ctrlKey) {
//         process.stdout.write('\033[?25h');
//         readline.cursorTo(process.stdout, 0, 0);
//         readline.clearScreenDown(process.stdout);
//         console.log('terminated');
//         process.exit(0);
//     }

//     for (let i = 0, len = keys.length; i < len; i++) {
//         if (e.keycode == keys[i]) {
//             cpu.keypad[i] = 1;
//             break;
//         }
//     }
// });

// iohook.on('keyup', e => {
//     for (let i = 0, len = keys.length; i < len; i++) {
//         if (e.keycode == keys[i]) {
//             cpu.keypad[i] = 0;
//             break;
//         }
//     }
// });

// iohook.start();

// let output = '';

const loop = _ => {
    time.now = Date.now();
    time.time_elapsed = time.now - time.then;
    // deltaTime += now - then;
    if (time.time_elapsed > time.fps_interval) {
        time.then = time.now - ((time.now - time.then) % (time.fps_interval));
        cpu.execute_cycle();
        output = '';

        if (cpu.draw_flag) {
            readline.cursorTo(process.stdout, 0, 0);

            for (let i = 0, len = cpu.video.length; i < len; i++) {
                if (cpu.video[i] == 0xFF) {
                    // process.stdout.write('#');
                    output += '\u2588';
                    // output += '■';
                } else {
                    // process.stdout.write(' ');
                    output += ' ';
                }
    
                if ((i + 1) % 64 == 0) {
                    output += "\n";
                }
            }

            cpu.draw_flag = false;

            process.stdout.write(c(output) + '\n' + '\033[?25l');
        }
    }

    setImmediate(loop);
}

// loop();

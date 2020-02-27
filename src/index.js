const fs = require('fs');
const readline = require('readline');

const iohook = require('iohook');
const argv = require('yargs').argv;
const { 
    red, 
    green, 
    yellow, 
    blue, 
    magenta, 
    cyan 
} = require('kleur');

const chip8_cpu = require('./cpu.js');

let colors = {
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan
}

let rom = fs.readFileSync(argv.rom);
let c = colors[argv.color];

let cpu = new chip8_cpu();
cpu.load_rom(rom);

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let now = 0;
let then = Date.now();
let deltaTime = 0;

process.stdin.on('keypress', (key, data) => {
    // if (data.name == 'escape') {
    //     process.exit(0);
    // }

    

    if (data.name == 'e' && data.ctrl) {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        process.stdout.write('\033[?25h');
        console.log('terminated');
        process.exit(0);
    }

    // console.log(data, "-", key);
});

iohook.on('keydown', e => {
    if (e.keycode == 2) {
        cpu.keypad[0] = 1;
    } else if (e.keycode == 3) {
        cpu.keypad[1] = 1;
    } else if (e.keycode == 4) {
        cpu.keypad[2] = 1;
    } else if (e.keycode == 5) {
        cpu.keypad[3] = 1;
    } else if (e.keycode == 16) {
        cpu.keypad[4] = 1;
    } else if (e.keycode == 17) {
        cpu.keypad[5] = 1;
    } else if (e.keycode == 18) {
        cpu.keypad[6] = 1;
    } else if (e.keycode == 19) {
        cpu.keypad[7] = 1;
    } else if (e.keycode == 30) {
        cpu.keypad[8] = 1;
    } else if (e.keycode == 31) {
        cpu.keypad[9] = 1;
    } else if (e.keycode == 32) {
        cpu.keypad[10] = 1;
    } else if (e.keycode == 33) {
        cpu.keypad[11] = 1;
    } else if (e.keycode == 44) {
        cpu.keypad[12] = 1;
    } else if (e.keycode == 45) {
        cpu.keypad[13] = 1;
    } else if (e.keycode == 46) {
        cpu.keypad[14] = 1;
    } else if (e.keycode == 47) {
        cpu.keypad[15] = 1;
    }
});

iohook.on('keyup', e => {
    if (e.keycode == 2) {
        cpu.keypad[0] = 0;
    } else if (e.keycode == 3) {
        cpu.keypad[1] = 0;
    } else if (e.keycode == 4) {
        cpu.keypad[2] = 0;
    } else if (e.keycode == 5) {
        cpu.keypad[3] = 0;
    } else if (e.keycode == 16) {
        cpu.keypad[4] = 0;
    } else if (e.keycode == 17) {
        cpu.keypad[5] = 0;
    } else if (e.keycode == 18) {
        cpu.keypad[6] = 0;
    } else if (e.keycode == 19) {
        cpu.keypad[7] = 0;
    } else if (e.keycode == 30) {
        cpu.keypad[8] = 0;
    } else if (e.keycode == 31) {
        cpu.keypad[9] = 0;
    } else if (e.keycode == 32) {
        cpu.keypad[10] = 0;
    } else if (e.keycode == 33) {
        cpu.keypad[11] = 0;
    }else if (e.keycode == 44) {
        cpu.keypad[12] = 0;
    }else if (e.keycode == 45) {
        cpu.keypad[13] = 0;
    }else if (e.keycode == 46) {
        cpu.keypad[14] = 0;
    }else if (e.keycode == 47) {
        cpu.keypad[15] = 0;
    }
});

iohook.start();

let output = '';

const loop = _ => {
    now = Date.now();
    // deltaTime += now - then;
    if (now - then > 1000 / 500) {
        cpu.execute_cycle();
        then = Date.now();
        deltaTime = 0;
        let output = '';

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

            process.stdout.write(c(output) + '\n' + "\033[?25l" + '\n');
        }
    }

    setImmediate(loop);
}

loop();

// for(;;) {
//     now = Date.now();
//     deltaTime += now - then;

//     if (deltaTime > 1000 / 50) {
//         then = Date.now();
//         deltaTime = 0;

//         cpu.execute_cycle();
//         let output = '';
//         readline.cursorTo(process.stdout, 0, 0);

//         for (let i = 0, len = cpu.video.length; i < len; i++) {
//             if (cpu.video[i] != 0) {
//                 // process.stdout.write('#');
//                 output += '\u2588';
//             } else {
//                 // process.stdout.write(' ');
//                 output += ' ';
//             }

//             if ((i + 1) % 64 == 0) {
//                 output += "\n";
//             }
//         }

//         process.stdout.write(c(output) + '\n' + "\033[?25l");
//     }
// }



// let fileSize = fileStat.size;
// let loaded = 0;

// let readStream = fs.createReadStream(argv.rom);

// readStream.on('data', (data) => {
//     console.log(data.length);
// });

// readStream.on('end', () => {
//     console.log('done');
// });
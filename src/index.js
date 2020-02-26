const fs = require('fs');
const readline = require('readline');

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
    if (data.name == '1') {
        cpu.keypad[0] = 1;
    }

    if (data.name == '2') {
        cpu.keypad[1] = 1;
    }

    if (data.name == '3') {
        cpu.keypad[2] = 1;
    }

    if (data.name == '4') {
        cpu.keypad[3] = 1;
    }

    if (data.name == 'q') {
        cpu.keypad[4] = 1;
    }

    if (data.name == 'w') {
        cpu.keypad[5] = 1;
    }

    if (data.name == 'e') {
        cpu.keypad[6] = 1;
    }

    if (data.name == 'r') {
        cpu.keypad[7] = 1;
    }

    if (data.name == 'a') {
        cpu.keypad[8] = 1;
    }

    if (data.name == 's') {
        cpu.keypad[9] = 1;
    }

    if (data.name == 'd') {
        cpu.keypad[10] = 1;
    }

    if (data.name == 'f') {
        cpu.keypad[11] = 1;
    }

    if (data.name == 'z') {
        cpu.keypad[12] = 1;
    }

    if (data.name == 'x') {
        cpu.keypad[13] = 1;
    }

    if (data.name == 'c') {
        cpu.keypad[14] = 1;
    }

    if (data.name == 'v') {
        cpu.keypad[15] = 1;
    }

    if (data.name == 'e' && data.ctrl) {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        process.stdout.write('\033[?25h');
        console.log('terminated');
        process.exit(0);
    }
});


let output = '';

const loop = _ => {
    now = Date.now();
    deltaTime += now - then;

    if (deltaTime > 1000 / 40) {
        then = Date.now();
        deltaTime = 0;

        cpu.execute_cycle();
        let output = '';

        if (cpu.draw_flag) {
            readline.cursorTo(process.stdout, 0, 0);

            for (let i = 0, len = cpu.video.length; i < len; i++) {
                if (cpu.video[i] != 0) {
                    // process.stdout.write('#');
                    output += '\u2588';
                } else {
                    // process.stdout.write(' ');
                    output += ' ';
                }
    
                if ((i + 1) % 64 == 0) {
                    output += "\n";
                }
            }

            cpu.draw_flag = false;

            for (let i = 0, len = cpu.keypad.length; i < len; i++) { 
                cpu.keypad[i] = 0;
            }

            process.stdout.write(c(output) + '\n' + "\033[?25l");
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
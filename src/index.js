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

// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

let now = 0;
let then = Date.now();
let deltaTime = 0;

// process.stdin.on('keypress', (key, data) => {
//     if (data.name == 'escape') {
//         process.exit(0);
//     }
// });

let output = '';

for(;;) {
    now = Date.now();
    deltaTime += now - then;

    if (deltaTime > 1000 / 50) {
        then = Date.now();
        deltaTime = 0;

        cpu.execute_cycle();
        let output = '';
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

        process.stdout.write(c(output) + '\n' + "\033[?25l");
    }
}



// let fileSize = fileStat.size;
// let loaded = 0;

// let readStream = fs.createReadStream(argv.rom);

// readStream.on('data', (data) => {
//     console.log(data.length);
// });

// readStream.on('end', () => {
//     console.log('done');
// });
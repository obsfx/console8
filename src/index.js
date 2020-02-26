const fs = require('fs');
const readline = require('readline');

const argv = require('yargs').argv;
const ansi_escapes = require('ansi-escapes');

const chip8_cpu = require('./cpu.js');

let rom = fs.readFileSync(argv.rom);

let cpu = new chip8_cpu();
cpu.load_rom(rom);

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

// setInterval(() => {
//     cpu.execute_cycle();
//     let output = '';
//     readline.cursorTo(process.stdout, 0, 0);

//     for (let i = 0; i < cpu.video.length; i++) {
//         if (cpu.video[i] != 0) {
//             // process.stdout.write('#');
//             output += '#';
//         } else {
//             // process.stdout.write(' ');
//             output += ' ';
//         }

//         if (i % 64 == 0) {
//             output += "\n";
//         }
//     }

//     console.log(output);

//     // process.stdout.write(ansi_escapes.eraseScreen);
//     // readline.clearScreenDown(process.stdout);
// }, 1000 / 60);

for(;;) {
    cpu.execute_cycle();
    let output = '';
    readline.cursorTo(process.stdout, 0, 0);

    for (let i = 0; i < cpu.video.length; i++) {
        if (cpu.video[i] != 0) {
            // process.stdout.write('#');
            output += '\u2588';
        } else {
            // process.stdout.write(' ');
            output += ' ';
        }

        if (i % 64 == 0) {
            output += "\n";
        }
    }

    process.stdout.write(output + '\n');
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
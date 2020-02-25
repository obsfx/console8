let fs = require('fs');

let argv = require('yargs').argv;

let chip8_cpu = require('./cpu.js');

let rom = fs.readFileSync(argv.rom);

let cpu = new chip8_cpu();
cpu.load_rom(rom);

setInterval(() => {
    cpu.execute_cycle();
}, 1);


// let fileSize = fileStat.size;
// let loaded = 0;

// let readStream = fs.createReadStream(argv.rom);

// readStream.on('data', (data) => {
//     console.log(data.length);
// });

// readStream.on('end', () => {
//     console.log('done');
// });
class CHIP8_CPU {
    constructor() {
        this.width = 64;
        this.height = 32;

        this.font_set_start_address = 0x50;
        this.program_counter_start_address = 0x200;

        this.font_set = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];

        this.reset();
        this.reset_memory();
    }

    reset() {
        this.registers = new Uint8Array(16);
        this.video = new Uint8Array(this.width * this.height);
        this.keypad = new Uint8Array(16);
        
        this.stack = new Uint16Array(16);
        this.stack_pointer = 0;

        this.delay_timer;

        this.opcode = 0;
        this.index = 0;
        this.program_counter = this.program_counter_start_address;

        this.draw_flag = false;
    }

    reset_memory() {
        this.memory = new Uint8Array(4096);

        for (let i = 0; i < this.font_set.length; i++) {
            this.memory[i + this.font_set_start_address] = this.font_set[i];
        }
    }

    load_rom(rom_buffer) {
        for (let i = 0; i < rom_buffer.length; i++) {
            this.memory[i + this.program_counter_start_address] = rom_buffer[i];
        }
    }

    async execute_cycle() {
        this.opcode = this.memory[this.program_counter] << 8 | this.memory[this.program_counter + 1];
        this.program_counter += 2;

        switch (this.opcode & 0xF000) {
            case 0x0000:
                {
                    switch(this.opcode & 0x000F) {
                        case 0x0000:
                            {
                                let i = 0;
    
                                while (i < this.video.length) {
                                    this.video[i++] = 0;
                                }

                                this.draw_flag = true;
                            }
                        break;
    
                        case 0x000E:
                            {
                                this.program_counter = this.stack[--this.stack_pointer];
                            }
                        break;
    
                        default:
                            console.log(`[0x0000]: 0x${this.opcode.toString(16)} undefined opcode`);
                        break;
                    }
                }
            break;

            case 0x1000:
                {
                    this.program_counter = this.opcode & 0x0FFF;
                }
            break;

            case 0x2000:
                {
                    this.stack[this.stack_pointer++] = this.program_counter;
                    this.program_counter = this.opcode & 0xFFF;
                }
            break;

            case 0x3000:
                {
                    let register = (this.opcode & 0x0F00) >> 8;
                    let value = this.opcode & 0x00FF;

                    if (this.registers[register] == value) {
                        this.program_counter += 2;
                    }
                }
            break;

            case 0x4000:
                {
                    let register = (this.opcode & 0x0F00) >> 8;
                    let value = this.opcode & 0x00FF;

                    if (this.registers[register] != value) {
                        this.program_counter += 2;
                    }
                }
            break;

            case 0x5000:
                {
                    let rx = (this.opcode & 0x0F00) >> 8;
                    let ry = (this.opcode & 0x00F0) >> 4;

                    if (this.registers[rx] == this.registers[ry]) {
                        this.program_counter += 2;
                    }
                }
            break;

            case 0x6000:
                {
                    let register = (this.opcode & 0x0F00) >> 8;
                    let value = this.opcode & 0x00FF;

                    this.registers[register] = value;
                }
            break;

            case 0x7000:
                {
                    let register = (this.opcode & 0x0F00) >> 8;
                    let value = this.opcode & 0x00FF;
    
                    this.registers[register] += value;
                }
            break;

            case 0x8000:
                {
                    switch (this.opcode & 0x000F) {
                        case 0x0000:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                this.registers[rx] = this.registers[ry];
                            }
                        break;
    
                        case 0x0001:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                this.registers[rx] |= this.registers[ry];
                            }
                        break;
    
                        case 0x0002:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                this.registers[rx] &= this.registers[ry];
                            }
                        break;
    
                        case 0x0003:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                this.registers[rx] ^= this.registers[ry];
                            }
                        break;
    
                        case 0x0004:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                let sum = this.registers[rx] + this.registers[ry];
        
                                if (sum > 255) {
                                    this.registers[15] = 1;
                                } else {
                                    this.registers[15] = 0;
                                }
        
                                this.registers[rx] = sum & 0xFF;
                            }
                        break;
    
                        case 0x0005:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                if (this.registers[rx] > this.registers[ry]) {
                                    this.registers[15] = 1;
                                } else {
                                    this.registers[15] = 0;
                                }
        
                                this.registers[rx] -= this.registers[ry];
                            }
                        break;
    
                        case 0x0006:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                this.registers[15] = this.registers[register] & 0x01;
        
                                this.registers[register] >>= 1;
                            }
                        break;
    
                        case 0x0007:
                            {
                                let rx = (this.opcode & 0x0F00) >> 8;
                                let ry = (this.opcode & 0x00F0) >> 4;
        
                                if (this.registers[ry] > this.registers[rx]) {
                                    this.registers[15] = 1;
                                } else {
                                    this.registers[15] = 0;
                                }
        
                                this.registers[rx] = this.registers[ry] - this.registers[rx];
                            }
                        break;
    
                        case 0x000E:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                this.registers[15] = (this.registers[register] & 0x80) >> 7;
        
                                this.registers[register] <<= 1;
                            }
                        break;
    
                        default:
                            console.log(`[0x8000]: 0x${this.opcode.toString(16)} undefined opcode`);
                        break;
                    }
                }
            break;

            case 0x9000:
                {
                    let rx = (this.opcode & 0x0F00) >> 8;
                    let ry = (this.opcode & 0x00F0) >> 4;
    
                    if (this.registers[rx] != this.registers[ry]) {
                        this.program_counter += 2;
                    }
                }
            break;

            case 0xA000:
                {
                    this.index = this.opcode & 0x0FFF;
                }
            break;

            case 0xB000:
                {
                    this.program_counter = (this.opcode & 0x0FFF) + this.registers[0];
                }
            break;

            case 0xC000:
                {
                    let register = (this.opcode & 0x0F00) >> 8;
                    let value = this.opcode & 0x00FF;
    
                    this.registers[register] = Math.floor(Math.random() * 256) & value;
                }
            break;

            case 0xD000:
                {
                    let rx = (this.opcode & 0x0F00) >> 8;
                    let ry = (this.opcode & 0x00F0) >> 4;
                    let h = this.opcode & 0x000F;
    
                    let xPos = this.registers[rx] % this.width;
                    let yPos = this.registers[ry] % this.height;

                    this.registers[15] = 0;
    
                    for (let row = 0; row < h; row++) {
                        let spriteByte = this.memory[this.index + row];
    
                        for (let col = 0; col < 8; col++) {
                            let spritePixel = spriteByte & (0x80 >> col);
                            let screenPixelIndex = yPos * 64 + row * 64 + xPos + col;
    
                            if (spritePixel) {
                                if (this.video[screenPixelIndex] == 0xFF) {
                                    this.registers[15] = 1;
                                }
    
                                this.video[screenPixelIndex] ^= 0xFF;
                            }
                        }
                    }

                    this.draw_flag = true;
                }
            break;

            case 0xE000:
                {
                    switch (this.opcode & 0x000F) {
                        case 0x000E:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                if (this.keypad[this.registers[register]]) {
                                    this.program_counter += 2;
                                }
                            }
                        break;
    
                        case 0x0001:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                if (!this.keypad[this.registers[register]]) {
                                    this.program_counter += 2;
                                }
                            }
                        break;
    
                        default:
                            console.log(`[0xE000]: 0x${this.opcode.toString(16)} undefined opcode`);
                        break;
                    }
                }
            break;

            case 0xF000:
                {
                    switch (this.opcode & 0x000F) {
                        case 0x0007:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
                            
                                this.registers[register] = this.delay_timer;
                            }
                        break;
    
                        case 0x000A:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                for (let i = 0; i < 16; i++) {
                                    if (this.keypad[i]) {
                                        this.registers[register] = i;
                                        return 0;
                                    }
                                }
        
                                this.program_counter -= 2;
                            }
                        break;
    
                        case 0x0005:
                            {
                                switch(this.opcode & 0x00F0) {
                                    case 0x0010:
                                        {
                                            let register = (this.opcode & 0x0F00) >> 8;
        
                                            this.delay_timer = this.registers[register];
                                        }
                                    break;
                                    
                                    case 0x0050:
                                        {
                                            let register = (this.opcode & 0x0F00) >> 8;
        
                                            for (let i = 0; i <= register; i++) {
                                                this.memory[this.index + i] = this.registers[i];
                                            }

                                            this.index += register + 1
                                        }
                                    break;
        
                                    case 0x0060:
                                        {
                                            let register = (this.opcode & 0x0F00) >> 8;
        
                                            for (let i = 0; i <= register; i++) {
                                                this.registers[i] = this.memory[this.index + i];
                                            }

                                            this.index += register + 1
                                        }
                                    break;
        
                                    default:
                                        console.log(`[0xF005]: 0x${this.opcode.toString(16)} undefined opcode`);
                                    break;
                                }
                            }
                        break;
    
                        case 0x0008:
                            //sound timer
                        break;
    
                        case 0x000E:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
                                
                                if (this.index + this.registers[register] > 0xFFF) {
                                    this.registers[15] = 1;
                                } else {
                                    this.registers[15] = 0;
                                }

                                this.index += this.registers[register];
                            }
                        break;
    
                        case 0x0009:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
                                let digit = this.registers[register];
        
                                this.index = this.font_set_start_address + (5 * digit);
                            }
                        break;
    
                        case 0x0003:
                            {
                                let register = (this.opcode & 0x0F00) >> 8;
    
                                this.memory[this.index] = (Math.floor(this.registers[register] / 100)) % 10;
                                this.memory[this.index + 1] = (Math.floor(this.registers[register] / 10)) % 10;
                                this.memory[this.index + 2] = this.registers[register] % 10;
                            }
                        break;
    
                        default:
                            console.log(`[0xF000]: 0x${this.opcode.toString(16)} undefined opcode`);
                        break;
                    }
                }
            break;

            default:
                console.log(`0x${this.opcode.toString(16)} undefined opcode`);
            break;
        }

        if (this.delay_timer > 0) {
            this.delay_timer--;
        }

        // console.log(this.opcode.toString(16));
    }
}

module.exports = CHIP8_CPU
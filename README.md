![](https://raw.githubusercontent.com/obsfx/console8/master/media/logo.png)

# console8 [![npm version](https://badge.fury.io/js/console8.svg)](https://badge.fury.io/js/console8)

`console8` is *yet another chip8 emulator* but works on your **command line**. `console8` simply uses your command line to render the graphics and does not require any GUI. 



# installation

```
npm install -g console8
```

`console8` uses `iohook` package to handle the keyboard events so you may have to install with `sudo` and -`-unsafe-perm=true` for post installation and execute with `sudo` to get necessary permissions from your system.

# how to use

![](https://raw.githubusercontent.com/obsfx/console8/master/media/1.gif)

You can simply use by passing `--rom` argument with the path of the rom file.

```
console8 --rom=./roms/wipeoff.rom
```

You can customize the display color and character by using this additional arguments;

```
--color=<rendering color of ON bits> (optional, default: white)
available colors: white, red, green, yellow, blue, magenta, cyan

--speed=<speed of cycle execution, 1000 / speed> (optional, default: 450)

--rendering_char=<ascii char that represents ON bits> (optional, default: █)
```

You can also see all available arguments by using --help argument;

```
console8 --help
```



###### wall

![](https://raw.githubusercontent.com/obsfx/console8/master/media/2.gif)

###### ufo

![](https://raw.githubusercontent.com/obsfx/console8/master/media/3.gif)

###### wipeoff with custom rendering character

![](https://raw.githubusercontent.com/obsfx/console8/master/media/4.gif)



# a warning

`console8` is an *experimental learning project* so some roms can be **buggy**.



# compatibility

I have tested on **Ubuntu 19.10** / **Lubuntu 19.10** / **Windows 10 x64**. I am not sure about macOS compatibility.



# for rom files

Rom files are not included with npm installation but you can find some of them in this github repository;

`badlogic / chip8`  https://github.com/badlogic/chip8/tree/master/roms



# cool resources

I learned tons of things from these great resources. If you are interested in emulators and if you want to learn how they are work, you may want to check them out;



#### *Guides*

`BUILDING A CHIP-8 EMULATOR [C++] `https://austinmorlan.com/posts/chip8_emulator/

`How to write an emulator (CHIP-8 interpreter)` http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/



#### *CHIP-8 References*

`Cowgod's Chip-8 Technical Reference v1.0` http://devernay.free.fr/hacks/chip8/C8TECH10.HTM

`Chip 8 instruction set` http://devernay.free.fr/hacks/chip8/chip8def.htm



#### *Source Reading*

`JamesGriffin / CHIP-8-Emulator` https://github.com/JamesGriffin/CHIP-8-Emulator
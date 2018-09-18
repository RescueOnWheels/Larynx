//Very ugly I know very WIP
const ip = require('ip');
const LCD = require('lcdi2c');

const lcd = new LCD(1, 0x27, 16, 2);
const ip_addr = ip.address();

lcd.clear();
lcd.print(ip_addr);

const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');

function Larynx() {
    this.emitter = new EventEmitter();
}

Larynx.prototype.Connect = () => {
        this.socket = io.connect('http://127.0.0.1:3000');

        this.socket.on('connect', () => {
            console.log("It's alive!");
        });

        this.socket.on('disconnect', () => {
            console.log("Disconnected");
            this.emit('disconnect');
        });

        this.socket.on('move', (data) => {
            this.emit('move', data);
        });
    };


module.exports = Larynx;

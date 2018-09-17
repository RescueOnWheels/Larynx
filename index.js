const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');

class Larynx extends EventEmitter {
    constructor() {
        super();
    }

    Connect() {
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
        })
    }

    Disconnect() {
        this.socket.disconnect();
        this.socket = null;
    }
}


module.exports = Larynx;

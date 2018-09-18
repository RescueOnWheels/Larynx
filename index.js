const DEBUG = false;

/* Start of IP screen */

const ip = require('ip');
const LCD = require('lcdi2c');

const lcd = new LCD(1, 0x27, 16, 2);
const ip_addr = ip.address();

lcd.clear();
lcd.print(ip_addr);

/* Start of program */

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const io = require('socket.io')();
const token = 'ABXY';

io.on('connection', (socket) => {
    /* Authentication */
    socket.emit('authenticate', (data) => {
        if (data !== token) {
            socket.disconnect();
            return;
        }

        socket.cockpit = true;
        socket.emit('authenticated');
    });

    /* Heartbeat */

    let isStoppped = false;
    let lastBeat = Date.now();

    setInterval(() => {
        if (lastBeat + 1000 < Date.now()) {
            if (isStoppped) {
                return;
            }

            isStoppped = true;
            Stop();
        }
    }, 100);

    socket.emit('heartbeat');
    socket.on('heartbeat', function() {
        if (DEBUG) console.log("heart");

        lastBeat = Date.now();
        socket.emit('heartbeat');
    });

    socket.on('disconnect', () => {
        Stop();
    });

    function Stop() {
        if (DEBUG) console.log("SOS");
        myEmitter.emit('disconnect');
    }

    /* Data Comms */
    socket.on('move', (data) => {
        if (!socket.cockpit) {
            return;
        }

        myEmitter.emit('move', data);
    });
});

io.listen(3000);

module.exports = myEmitter;
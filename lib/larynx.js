const DEBUG = false;

/* Start of IP screen */

const ip = require('ip');
const LCD = require('lcdi2c');

const lcd = new LCD(1, 0x27, 16, 2);
const ipAddress = ip.address();
const token = GetToken();

lcd.clear();
lcd.print(ipAddress);
lcd.print(token);

/* Start of program */

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const io = require('socket.io')();

/**
 * generates and returns token
 * @param n length of token
 * @returns {string} token
 * @constructor
 */
function GetToken(n = 4) {
    const buttons = ['A', 'B', 'X', 'Y'];
    let pre_token = '';
    for (i = 0; i < n; i++) {
        pre_token += buttons[Math.floor(Math.random()*4)];
    }
    return pre_token;
}

io.on('connection', (socket) => {
  /* Authentication */
  socket.emit('authenticate', (data) => {
    if (data !== token) {
      socket.disconnect();
      return;
    }

    socket.cockpit = true; // eslint-disable-line no-param-reassign
    socket.emit('authenticated');
  });

  /* Heartbeat */

  function Stop() {
    if (DEBUG) console.log('SOS');
    myEmitter.emit('disconnect');
  }

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
  socket.on('heartbeat', () => {
    if (DEBUG) console.log('heart');

    lastBeat = Date.now();
    socket.emit('heartbeat');
  });

  socket.on('disconnect', () => {
    Stop();
  });

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

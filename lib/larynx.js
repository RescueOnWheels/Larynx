/**
 * Boolean that enables/disables the logging functionality.
 */
const DEBUG = false;

/**
 * Packages
 */
const ip = require('ip');
const EventEmitter = require('events');
const io = require('socket.io')();

/**
 * Helpers
 */
const generateToken = require('./helpers/generateToken');
const lcd = require('./helpers/screen');

/**
 * Clean display.
 */
lcd.clear();

/**
 * Put the IP address on the first line of the screen.
 */
const ipAddress = ip.address();
lcd.println(ipAddress, 1);

/**
 * Put the authorization token on the second line of the screen.
 */
const token = generateToken();
lcd.println(token, 2);

/* Start of program */

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

io.on('connection', (socket) => {
  /* Authentication */
  socket.emit('authenticate', (data) => {
    if (data !== token) {
      socket.disconnect();
      return;
    }
	
	lcd.clearln(2);
	lcd.println('connected');
    socket.cockpit = true; // eslint-disable-line no-param-reassign
    socket.emit('authenticated');
  });

  /* Heartbeat */

  function Stop() {
    if (DEBUG) console.info('SOS');
    myEmitter.emit('disconnect');
	
	lcd.clearln(2);
	lcd.println(token);
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
    if (DEBUG) console.debug('heart');

    lastBeat = Date.now();
    socket.emit('heartbeat');
  });

  socket.on('disconnect', () => {
    Stop();
  });

  /**
     * Pass all movement data to the Rover.
     */
  socket.on('move', (data) => {
    if (!socket.cockpit) {
      return;
    }

    myEmitter.emit('move', data);
  });

  /**
     * Trigger the `stop` event whenever the controller is disconnected.
     */
  socket.on('controller disconnect', () => {
    if (!socket.cockpit) {
      return;
    }

    Stop();
  });
});

io.listen(3000);

module.exports = myEmitter;

/**
 * Debug dependencies
 */
const debug = require('debug')('RRS:Larynx');

/**
 * Packages
 */
const ip = require('ip');
const EventEmitter = require('events');
const io = require('socket.io')();
const middleware = require('socketio-wildcard')();

io.use(middleware);

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
  let lastMessage;
  let hasStopped;

  socket.on('*', () => {
    if (!socket.cockpit) {
      return;
    }

    lastMessage = Date.now();
  });

  debug('Socket connected');

  function stop() {
    if (!socket.cockpit) {
      return;
    }

    debug('Stop');

    hasStopped = true;

    /**
     * Notify the Rover that we have lost connection to the cockpit.
     */
    myEmitter.emit('disconnect');

    /**
     * Put the authorization token on the second line of the screen.
     */
    lcd.clearln(2);
    lcd.println(token, 2);
  }

  /* Authentication */
  socket.emit('authenticate', (data) => {
    if (data !== token) {
      socket.disconnect();
      return;
    }

    /**
     * Remove authorization code from screen.
     */
    lcd.clearln(2);
    lcd.println('connected', 2);

    /**
     * Allow this socket to control the Rover.
     */
    socket.cockpit = true; // eslint-disable-line no-param-reassign
    socket.emit('authenticated');

    debug('authenticated');

    setInterval(() => {
      if (lastMessage + 500 < Date.now()) {
        if (hasStopped) {
          return;
        }

        debug('Please staph.');

        hasStopped = true;
        stop();
      }
    });
  });

  socket.on('disconnect', () => {
    debug('Socket disconnected');

    stop();
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

    stop();
  });
});

io.listen(3000);

module.exports = myEmitter;

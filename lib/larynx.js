/**
 * Debug dependencies
 */
const debug = require('debug')('RRS:Larynx');

/**
 * Packages
 */
const ip = require('ip');
const EventEmitter = require('events');

/**
 * Socket.IO
 */
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
  debug('Socket connected');

  let lastMessage = Date.now();
  let hasStopped = false;

  /**
   * Update lastMessage, if the socket is the Cockpit.
   */
  socket.on('*', () => {
    if (!socket.cockpit) {
      return;
    }

    lastMessage = Date.now();
  });

  function stop() {
    if (!socket.cockpit) {
      return;
    }

    hasStopped = true;

    debug('STOP IT; STOP IT NOW!');

    /**
     * Notify the Rover that we have lost connection to the Cockpit.
     */
    myEmitter.emit('disconnect');

    /**
     * Put the authorization token on the second line of the screen.
     */
    lcd.clearln(2);
    lcd.println(token, 2);
  }

  /**
   * Authenticate the socket;
   * only required if the socket wants to control the Rover.
   */
  socket.emit('authenticate', (data) => {
    if (data !== token) {
      socket.disconnect();
      return;
    }

    debug('With Great Power Comes Great Responsibility.');

    /**
     * Allow this socket to control the Rover.
     */
    socket.cockpit = true; // eslint-disable-line no-param-reassign
    socket.emit('authenticated');

    /**
     * Remove authorization code from screen.
     */
    lcd.clearln(2);
    lcd.println('connected', 2);

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

    /**
     * We only care about stopping if the socket was the Cockpit.
     */
    if (!socket.cockpit) {
      return;
    }

    stop();
  });

  /**
   * Pass all movement data to the Rover.
   */
  socket.on('move', (data) => {
    if (!socket.cockpit) {
      return;
    }

    debug('Move it to the %o', data);

    myEmitter.emit('move', data);
  });

  /**
   * Trigger the `stop` event whenever the controller is disconnected.
   */
  socket.on('controller disconnect', () => {
    if (!socket.cockpit) {
      return;
    }

    debug('And it\'s gone...');

    stop();
  });

  socket.on('headset position', (position) => {
    myEmitter.emit('camera move', JSON.parse(position));
  });
});

io.listen(3000);

module.exports = myEmitter;

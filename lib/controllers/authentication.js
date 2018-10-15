/* Debug */
const debug = require('debug')('RRS:Larynx:Authentication');

/* Packages */
const ip = require('ip');

/* Controllers */
const heartbeat = require('./heartbeat');

/* Helpers */
const lcd = require('./../helpers/screen');
const generateToken = require('./../helpers/generateToken');

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

module.exports = (socket) => {
  socket.emit('authenticate', (data) => {
    if (data !== token) {
      socket.disconnect();
      return;
    }

    debug('With Great Power Comes Great Responsibility.');

    /**
     * Allow this socket to control the Rover.
     */
    socket.isCockpit = true;
    socket.emit('authenticated');

    /**
     * Remove authorization code from screen.
     */
    lcd.clearln(2);
    lcd.println('connected', 2);

    /**
     * Add heartbeat to socket.
     */
    heartbeat(socket);
  });

  socket.on('disconnect', () => {
    if (!socket.isCockpit) {
      return;
    }

    /**
     * Put the authorization token back on screen.
     */
    lcd.clearln(2);
    lcd.println(token, 2);
  });

  return socket;
};

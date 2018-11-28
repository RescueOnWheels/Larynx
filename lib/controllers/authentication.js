/* Packages */
const ip = require('ip');
const isOnline = require('is-online');

/* Auxilio */
const {
  Debug,
} = require('./../Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx:Authentication');

/* Controllers */
const heartbeat = require('./heartbeat');

/* Helpers */
const lcd = require('./../helpers/screen');
const generateToken = require('./../helpers/generateToken');

/**
 * Function to check for internet connection.
 */
function checkOnline() {
  isOnline().then((online) => {
    if (online) {
      lcd.clearln(1);
      lcd.println(ip.address(), 1);
    } else {
      clearInterval(checkOnline);
      lcd.clearln(1);
      lcd.println('not online', 1);
    }
  });
}

/**
 * Start checking if rover is online every second.
 */
setInterval(checkOnline, 1000);

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
    if (data === 'headset') {
      socket.isHeadset = true;
      return;
    }

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
    lcd.clearln(2);
    lcd.println('disconnected', 2);

    if (!socket.isCockpit) {
      return;
    }

    clearInterval(socket.heartbeat);

    /**
     * Put the authorization token back on screen.
     */
    lcd.clearln(2);
    lcd.println(token, 2);
  });

  return socket;
};

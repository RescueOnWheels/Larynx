/* Packages */
const ip = require('ip');
const isOnline = require('is-online');

/* Auxilio */
const {
  Debug,
  generateToken,
} = require('./../Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx:Authentication');

/* Controllers */
const heartbeat = require('./heartbeat');

/* Helpers */
const lcd = require('./../helpers/screen');

const self = this;

let prevIsOnline;

/**
 * Function to check for internet connection.
 */
function checkOnline() {
  isOnline().then((online) => {
    if (online && !prevIsOnline) {
      prevIsOnline = true;

      lcd.clearln(1);
      lcd.println(ip.address(), 1);
    } else if (!online && prevIsOnline) {
      prevIsOnline = false;

      lcd.clearln(1);
      lcd.println('not online', 1);
    }

    setTimeout(checkOnline.bind(self), 1000);
  });
}

/* Clean display. */
lcd.clear();

/* Put the authorization token on the second line of the screen. */
const token = generateToken();
lcd.println(token, 2);

/* Start interval to check network status. */
checkOnline();

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

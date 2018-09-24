/**
 * Packages
 */
const ip = require('ip');

/**
 * Helpers
 */
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

/**
 * Library for accessing LCD character displays using I2C via a PCF8574 port expander.
 */
const LCD = require('./interfaces/lcdi2c');

class Screen {
  constructor(address = 0x27) {
    this.lcd = new LCD(1, address, 16, 2);
  }

  print(str) {
    this.lcd.print(str);
  }

  println(str, ln) {
    this.lcd.println(str, ln);
  }

  clear() {
    this.lcd.clear();
  }

  on() {
    this.lcd.on();
  }

  off() {
    this.lcd.off();
  }

  clearln(ln) {
    this.lcd.println('                ', ln);
  }
}

/**
 * Constructor
 *
 * Allows the user to create their own instance of Screen,
 * should be used whenever the screen is not on I2C adress 0x27.
 */
Screen.prototype.Screen = Screen;

/**
 * Singleton
 *
 * Because `require` caches the value assigned to `module.exports`,
 * all calls to `require` will return this same instance.
 */
module.exports = exports = new Screen(); // eslint-disable-line no-multi-assign

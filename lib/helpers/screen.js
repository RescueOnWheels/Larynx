/**
 * Library for accessing LCD character displays using I2C via a PCF8574 port expander.
 */
const LCD = require('./interfaces/lcdi2c');

class Screen {
  constructor(address = 0x27) {
    this.lcd = new LCD(1, address, 16, 2);
  }

  println(str, ln) {
    this.lcd.println(str, ln);
  }

  clear() {
    this.lcd.clear();
  }

  clearln(ln) {
    this.lcd.println('                ', ln);
  }
}

/**
 * Singleton pattern because `require` caches the value assigned to `module.exports`,
 * all calls to `require` will return this same instance.
 */
module.exports = exports = new Screen(); // eslint-disable-line no-multi-assign

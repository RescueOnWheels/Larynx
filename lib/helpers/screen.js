/**
 * Bindings for i2c-dev. Plays well with Raspberry Pi and Beaglebone.
 */

const LCD = require('lcdi2c');

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
}
module.exports = exports = new Screen(); // eslint-disable-line no-multi-assign

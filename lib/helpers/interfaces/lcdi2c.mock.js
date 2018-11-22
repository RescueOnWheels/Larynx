/* Auxilio */
const {
  Debug,
} = require('./../../Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx:Screen');

class LCD {
  constructor(device, address, cols, rows) {
    this.device = device;
    this.address = address;
    this.cols = cols;
    this.rows = rows;

    this.display = [];
    this.clear();
  }

  clear() {
    this.display = [];
    for (let i = 0; i < this.rows; i += 1) {
      let toPush = '';
      for (let j = 0; j < this.cols; j += 1) {
        toPush += ' ';
      }

      this.display.push(toPush);
    }

    this.printScreen();
  }

  println(str, ln) {
    this.display[ln - 1] = str + (this.display[ln - 1]).substr(str.length);

    this.printScreen();
  }

  printScreen() {
    for (let i = 0; i < this.rows; i += 1) {
      debug('Line %d: %s', i + 1, this.display[i]);
    }
  }
}

module.exports = LCD;

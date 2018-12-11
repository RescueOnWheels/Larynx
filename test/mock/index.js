/* Helpers */
const screen = require('./helpers/screen.test');

/* Lib */
const Auxilio = require('./../../lib/Auxilio/test');

describe('Mock', () => {
  describe('helpers', () => {
    describe('screen', screen);
  });

  describe('lib', () => {
    describe('Auxilio', Auxilio);
  });
});

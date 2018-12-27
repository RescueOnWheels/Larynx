const larynx = require('./larynx.test');

/* Helpers */
const screen = require('./helpers/screen.test');

/* Lib */
const Auxilio = require('./../../lib/Auxilio/test');

describe('Mock', () => {
  describe('larynx', larynx);

  describe('helpers', () => {
    describe('screen', screen);
  });

  describe('lib', () => {
    describe('Auxilio', Auxilio);
  });
});

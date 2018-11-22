/* Helpers */
const generateToken = require('./helpers/generateToken.test');

/* Lib */
const Auxilio = require('./../../lib/Auxilio/test');

describe('Mock', () => {
  describe('helpers', () => {
    describe('generateToken', generateToken);
  });

  describe('lib', () => {
    describe('Auxilio', Auxilio);
  });
});

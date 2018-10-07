/* eslint-disable require-jsdoc, prefer-rest-params */

let toMockOrNotToMockThatIsTheQuestion;
if (process.env.NODE_ENV) {
  console.warn('Larynx: Using the mock LCDI2C package!'); // eslint-disable-line no-console
  toMockOrNotToMockThatIsTheQuestion = ('./lcdi2c.mock');
} else {
  toMockOrNotToMockThatIsTheQuestion = ('lcdi2c');
}

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(toMockOrNotToMockThatIsTheQuestion);

let toMockOrNotToMockThatIsTheQuestion;

/* istanbul ignore else */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'CI') {
  // eslint-disable-next-line no-console
  console.warn('Larynx: Using the mock LCDI2C package!');

  toMockOrNotToMockThatIsTheQuestion = ('./lcdi2c.mock');
} else {
  toMockOrNotToMockThatIsTheQuestion = ('lcdi2c');
}

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(toMockOrNotToMockThatIsTheQuestion);
